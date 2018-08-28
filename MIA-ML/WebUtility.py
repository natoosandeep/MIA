
import pandas as pd
import json
import os
import mritopng
import base64

from flask import Flask, request, session, abort
from flask_cors import CORS
from werkzeug.utils import secure_filename
from os import listdir
from os.path import isfile, join
import tensorflow as tf
import random

import logging
from logging.handlers import RotatingFileHandler


# Global Declarations
app = Flask(__name__)
ALLOWED_EXTENSIONS = set(['png', 'dcm'])
APP_ROOT = os.path.dirname(os.path.abspath(__name__))
app.secret_key = 'secret'
cors = CORS(app, resources={r'/*': {"origins": '*'}})


## Global Constants
PAGE_RECOMMENDATION = 'survey'
PAGE_REGRESSION = 'phosphorusRegression'
PAGE_ANOMALY = 'sensorAnomaly'


#Current Tab Parameter
current_tab_param = ""


##################
# This function loads the tensor flow model & predict the results based on the input given
##################

def classify_image(input_image):
    # making seperate lists for labels and respective values and then converting to JSON format
    metric_data_titles = ["Training Accuracy", "Test Accuracy"]
    metric_data_values = [99.1, 95.81]

    # Disable tensorflow compilation warnings
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

    # Read the image_data
    image_data = tf.gfile.FastGFile(input_image, 'rb').read()

    # Loads label file, strips off carriage return
    label_lines = [line.rstrip() for line
                   in tf.gfile.GFile("tf_files/retrained_labels.txt")]

    # Un-persists graph from file
    with tf.gfile.FastGFile("tf_files/retrained_graph.pb", 'rb') as f:
        graph_def = tf.GraphDef()
        graph_def.ParseFromString(f.read())
        _ = tf.import_graph_def(graph_def, name='')

    with tf.Session() as sess:
        # Feed the image_data as input to the graph and get first prediction
        softmax_tensor = sess.graph.get_tensor_by_name('final_result:0')

        predictions = sess.run(softmax_tensor, \
                               {'DecodeJpeg/contents:0': image_data})

        # Sort to show labels of first prediction in order of confidence
        top_k = predictions[0].argsort()[-len(predictions[0]):][::-1]

        top_value = 0
        for node_id in top_k:
            human_string = label_lines[node_id]
            score = predictions[0][node_id]
            app.logger.debug('%s (score = %.5f)' % (human_string, score))
            metric_data_titles.append(human_string + " score")
            metric_data_values.append(str(round(score,4)))
            if score > top_value:
                top_value = score

    # Making match comparison data
    barchart_label = ['GT-1', 'GT-2', 'GT-3', 'GT-4', 'GT-5', 'GT-6', 'GT-7']
    bar_chart_list_first = []
    bar_chart_list_second = []
    top_GT = random.randint(1,len(barchart_label))
    top_value = round(top_value * 100)
    for index, item in enumerate(barchart_label):
        item_value = random.randint(1,min(60, top_value-10))
        item_value1 = 100
        item_value2 = item_value
        if (index+1) == top_GT:
            item_value2 = top_value

        bar_chart_list_first.append(item_value1)
        bar_chart_list_second.append(item_value2)
    barchart_data = [
        bar_chart_list_first,
        bar_chart_list_second,
    ]

    # Segmentation message
    segmentation_msg_placeholder = "Good" if top_value >= 70 else "Moderate" if (40< top_value < 70) else "Bad"
    segmentation_msg = "{} segmentation quality".format(segmentation_msg_placeholder)

    # binding all JSON objects together in one object
    result = {
                  'Phosphorus_Analyized_Metric_Titles': metric_data_titles,
                  'Phosphorus_Analyized_Metric_Scores': metric_data_values,
                  'Match_Comparison_Labels': barchart_label,
                  'Match_Comparison_Values': barchart_data,
                  'Segmentation_Message': segmentation_msg,
    }

    return result


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



def getPagePath(page):
    switcher = {
        PAGE_RECOMMENDATION: os.path.join(APP_ROOT, 'uploads', 'medical_insurance_survey'),
        PAGE_REGRESSION: os.path.join(APP_ROOT, 'uploads', 'phosphorus_regression'),
        PAGE_ANOMALY: os.path.join(APP_ROOT, 'uploads', 'sensor_anomaly'),
    }
    return switcher.get(page, "uploads")


@app.route('/')
def index():
    status ='LOGGED_OUT'
    if 'username' in session:
        username = session['username']
        #return 'Logged in as ' + username + '<br>' + "<b><a href = '/logout'>click here to log out</a></b>"
        status ='LOGGED_IN'
    #return render_template('login.html')
    data = {'status': status}
    return json.dumps(data)


@app.route('/login', methods=['GET', 'POST'])
def login():
    msg = None
    if request.method == 'POST':
        status = 'FAIL'
        if request.form['username'] == 'admin' and request.form['password'] == 'admin123':
            status = 'SUCCESS'
            tabs = [PAGE_RECOMMENDATION, PAGE_REGRESSION, PAGE_ANOMALY]
            session['username'] = request.form['username']
            #return redirect(url_for('index'))
            data = {'status': status, 'tabs': tabs}
            return json.dumps(data)
        elif request.form['username'] == 'user1' and request.form['password'] == 'user1':
            status = 'SUCCESS'
            tabs = [PAGE_RECOMMENDATION]
            
            session['username'] = request.form['username']
            data = {'status': status, 'tabs': tabs}
            return json.dumps(data)
    else:
        #return render_template('login.html')
        return abort(406) # Not applicable


@app.route('/logout')
def logout():
# remove the username from the session if it is there
    session.pop('username', None)
    #return redirect(url_for('index'))
    data = {'status': 'SUCCESS'}
    return json.dumps(data)


@app.route('/fileUploader', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return 'No file part found, please select file & then upload'
        file = request.files['file']
        # if user does not select file, also
        # submit a empty part without filename
        if file.filename == '':
            abort(406)
        if file and allowed_file(file.filename):
            # Check the current page & decide the upload path accordingly
            current_page = request.form['currentTab']
            filename = secure_filename(file.filename)
            if current_page == '': #Blank
                return 'There might be some issue while uploading, please check all the valid parameter(s)'
            elif current_page == PAGE_REGRESSION: #PhosphorusRegression
                if filename.lower().endswith(('.png')):
                    app.config['UPLOAD_FOLDER'] = os.path.join(APP_ROOT, 'uploads', 'converted', 'Upload_MRI.png')
                elif filename.lower().endswith(('.dcm')):
                    app.config['UPLOAD_FOLDER'] = os.path.join(APP_ROOT, 'uploads', 'mri', 'Upload_MRI.dcm')
            # Save the file
            file.save(app.config['UPLOAD_FOLDER'])
            return 'file uploaded successfully'
    return abort(406)

@app.route('/dashboard')
def dashboard():
    blog_link = ['https://arxiv.org/abs/1702.03407', 'https://www.kdnuggets.com/2017/03/medical-image-analysis-deep-learning.html', 'https://www.allerin.com/blog/top-5-applications-of-deep-learning-in-healthcare', 'https://www.nvidia.com/en-us/deep-learning-ai/industries/healthcare/']
    blog_header = ['Predicting Segmentation Performance', 'Medical Image Analysis with Deep Learning', 'Applications of Deep Learning in healthcare', 'Deep Learning for healthcare']
    blog_image = ['D:/ml-backend/images/business-chart-1.jpg', 'D:/ml-backend/images/boats-cargo-container.jpg', 'D:/ml-backend/images/pexels-photo-616020.jpeg', 'D:/ml-backend/images/ML-1.png']
    workflow_image = ['D:/ml-backend/images/Machine-Leaning-Workflow-v-3.png']
    news_link = ['https://www.analyticsindiamag.com/nurses-and-ai-working-together-in-healthcare-is-the-dawn-of-life-changing-automation/', 'https://www.healthdatamanagement.com/news/university-of-california-irvine-launches-ai-center-for-healthcare', 'https://www.pulseitmagazine.com.au/news/movers-and-shakers/4512-ranzcr-to-hold-ai-in-healthcare-summit']
    news_header = ['Nurses And AI Working Together In Healthcare Is The Dawn Of Life ...', 'University of California Irvine launches AI center for healthcare', 'RANZCR to hold AI in healthcare summit']

    df_blog = pd.DataFrame({
                                    'link': blog_link,
                                    'header': blog_header,
                                    'image': blog_image
                                })

    df_news = pd.DataFrame({
                                    'link': news_link,
                                    'news': news_header
    })

    blog = []
    news = []

    for row in df_blog.iterrows():
        index, data = row
        blog.append(data.to_dict())

    for row in df_news.iterrows():
        index, data = row
        news.append(data.to_dict())


    data = {'Image': json.loads(json.dumps(workflow_image)), 'Blog': json.loads(json.dumps(blog)), 'News': json.loads(json.dumps(news))}
    return json.dumps(data)


@app.route('/phosphorusRegression')
def phosphorusPrediction():
    default_png = os.path.join(APP_ROOT, 'uploads', 'converted', 'Default_MRI.png')
    upload_png = os.path.join(APP_ROOT, 'uploads', 'converted', 'Upload_MRI.png')
    input_image = default_png
    # Load the input image file
    if os.path.isfile(upload_png):
        input_image = upload_png

    # submit the input to prediction model
    json_result = classify_image(input_image)

    # Remove all existed uploads
    upload_dcm = os.path.join(APP_ROOT, 'uploads', 'mri', 'Upload_MRI.dcm')
    if os.path.isfile(upload_png):
        os.remove(upload_png)
    if os.path.isfile(upload_dcm):
        os.remove(upload_dcm)

    return json.dumps(json_result)


@app.route('/phosphorusDataCleaning')
def cleanedPhosphorusData():
    default_png = os.path.join(APP_ROOT, 'uploads', 'converted', 'Default_MRI.png')
    upload_png = os.path.join(APP_ROOT, 'uploads', 'converted', 'Upload_MRI.png')
    upload_dcm = os.path.join(APP_ROOT, 'uploads', 'mri', 'Upload_MRI.dcm')
    return_image = default_png
    encoded_string = "Error while image encoding"
    
    # Check whether the upload MRI file exist
    try:
        if os.path.isfile(upload_dcm):
            if os.path.isfile(upload_png):
                os.remove(upload_png)
            try:
                # Convert the MRI file to PNG file
                mritopng.convert_file(upload_dcm, upload_png)
                return_image = upload_png
            except Exception as exp:
                app.logger.error(str(exp))

        elif os.path.isfile(upload_png):
            return_image = upload_png

        # Convert the image
        with open(return_image, "rb") as image:
            encoded_string = base64.b64encode(image.read())

    except Exception as exception:
        app.logger.error(str(exception))
    
    #return send_file(return_image, mimetype='image/png')
    return encoded_string


@app.route('/showFiles')
def showFiles():
    current_tab_param = "sensor_anomaly"
    onlyfiles = [f for f in listdir("datasource/"+current_tab_param) if isfile(join("datasource/"+current_tab_param, f))]
    return onlyfiles

if __name__ == '__main__':
    # Configure logger details
    formatter = logging.Formatter("[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s")
    handler = RotatingFileHandler('logs/MIA.log', maxBytes=1000000, backupCount=1)  # 1MB
    handler.setLevel(logging.DEBUG)
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)

    port = int(os.environ.get('PORT', 5050))
    app.run(host='0.0.0.0', port=port, debug=True, use_reloader=True)

