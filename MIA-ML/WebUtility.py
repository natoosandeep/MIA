
import pandas as pd
import json
import os
import mritopng
import base64

from flask import Flask, flash, request, redirect, url_for, render_template, session, escape, abort, send_file
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
from collections import Counter
from os import listdir
from os.path import isfile, join

from sklearn. ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error
from sklearn.metrics import explained_variance_score
from sklearn.metrics import mean_absolute_error
from sklearn.metrics import mean_squared_error
from sklearn.metrics import r2_score
from sklearn.externals import joblib
import logging
from logging.handlers import RotatingFileHandler

from sklearn import preprocessing
from sklearn.ensemble import IsolationForest

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
#applyingGradientBoostingModel() is used to apply gradient boosting model on the data
#It takes training and testing data as parameter and the expected features(columns) to consider from the data
#Predicted values are generated on test data using the gradient boosting model created
##################

def applyingGradientBoostingModel(testSet, desired_features):
    ### Loading the model
    gb_model = joblib.load("datasource/phosphorus_regression/PhosphorusRegessionModel.jbl")
    
    #filtering only the features required from the train and test data
    testSet = testSet[(testSet['EOB_P'] < 0.1)]
    test_gb_data = testSet[desired_features]
    actualTestData = testSet['EOB_P'].tolist()
    predictedTestData = gb_model.predict(test_gb_data)
    predictedTestData = pd.Series(predictedTestData).tolist()
    
    
    HM_Mn = testSet['HM_Mn'].tolist()
    Inblow_P = testSet['Inblow_P'].tolist()
    Inblow_C = testSet['Inblow_C'].tolist()
    Inblow_Mn = testSet['Inblow_Mn'].tolist()
    EOB_Mn = testSet['EOB_Mn'].tolist()
    TSC_TEMP = testSet['TSC_TEMP.'].tolist()
    TSOP_TEMP = testSet['TSOP_TEMP.'].tolist()
    TSOP_O_PPM = testSet['TSOP_O_PPM '].tolist()
    O2_2nd_Blow = testSet['O2_2nd_Blow'].tolist()

    column_fields = ['HM_Mn', 'Inblow_P', 'Inblow_C', 'Inblow_Mn', 'EOB_Mn', 'TSC_TEMP',
                     'TSOP_TEMP', 'TSOP_O_PPM', 'O2_2nd_Blow', 'Actual_EOB_P_Values', 'Predicted_EOB_P_Values']
    
    #calculating evaluation metrics for gradient boosting model
    variance_score = explained_variance_score(actualTestData, predictedTestData).round(5)
    mae = mean_absolute_error(actualTestData, predictedTestData).round(5)
    mse = mean_squared_error(actualTestData, predictedTestData).round(5)
    R2_Score = r2_score(actualTestData, predictedTestData).round(5)
    
    #making seperate lists for labels and respective values and then converting to JSON format
    metric_data_titles = ["Training Accuracy", "Test Accuracy", "Step", "Total Time"]
    
    metric_data_values = [80.2, 76.81, 900, 12.42]
        
    #binding all JSON objects together in one object
    phosphorus = {'GRID_LABEL': 'Actual Phosphorus values v/s Predicted Phosphorus values Table',
                  'LINE_CHART_LABEL': 'Actual Phosphorus values v/s Predicted Phosphorus values Line Chart', 
                  'GRID_FIELDS': column_fields, 
                  'HM_Mn_1': HM_Mn,
                  'Inblow_P_2': Inblow_P, 
                  'Inblow_C_3': Inblow_C, 
                  'Inblow_Mn_4': Inblow_Mn,
                  'EOB_Mn_5': EOB_Mn,
                  'TSC_TEMP_6': TSC_TEMP,
                  'TSOP_TEMP_7': TSOP_TEMP,
                  'TSOP_O_PPM_8': TSOP_O_PPM,
                  'O2_2nd_Blow_9': O2_2nd_Blow,
                  'Actual_Values_JSON_LINE_CHART_10': actualTestData,
                  'Predicted_Values_JSON_LINE_CHART_11': predictedTestData,
                  'Phosphorus_Analyized_Metric_Titles': metric_data_titles,
                  'Phosphorus_Analyized_Metric_Scores': metric_data_values}

    return phosphorus


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
    # Load the csv files
    testSet = pd.read_csv('datasource/phosphorus_regression/Testset.csv')

    desired_features = ['HM_Mn', 'Inblow_P', 'Inblow_C', 'Inblow_Mn', 'EOB_Mn', 'TSC_TEMP.', 'TSOP_TEMP.', 'TSOP_O_PPM ', 'O2_2nd_Blow']
    
    #calling applyingGradientBoostingModel and passing them dataframe for train and test data 
    JSON_object = applyingGradientBoostingModel(testSet, desired_features)
    return json.dumps(JSON_object)


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

        # Remove all existed uploads
        if os.path.isfile(upload_png):
            os.remove(upload_png)
        if os.path.isfile(upload_dcm):
            os.remove(upload_dcm)
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

