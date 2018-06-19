
import pandas as pd
import numpy as np
import re
import csv
import json
import os
import sklearn
import mritopng

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

from sklearn import preprocessing
from sklearn.ensemble import IsolationForest

# Global Declarations
app = Flask(__name__)
ALLOWED_EXTENSIONS = set(['jpeg', 'jpg', 'png', 'dcm', 'DICOM'])
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
    metric_data_titles = ["Variance Score", "Mean Absolute Error", "Mean Squared Error", "R2 Score"]
    
    metric_data_values = [variance_score, mae, mse, R2_Score]
        
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


def cleanPhosphorusData(fname):
    dataset = pd.read_csv(fname, encoding = "ISO-8859-1")
    names = dataset.filter(['HM Mn', 'TSC TEMP.', 'TSOP TEMP.', 'TSOP O PPM', 'Inblow P', 'Inblow C', 'O2 2nd blow', 'inblow Mn', 'EOB_P'])

    whole_data = names.shape[0]
    negative = names.lt(0).sum().sum().item()
    missing_values = names.isnull().any(axis = 1).sum().sum().item()
    names.dropna(inplace = True)
       
    outlierIndex = outliers_iqr(names['EOB_P'])
    p = names['EOB_P'].loc[outlierIndex]
    outlier_count = len(p)

    clean_data = names.shape[0] - negative - outlier_count
    
    pie_negative_value = round(((negative / whole_data) * 100), 4)
    pie_missing_values = round(((missing_values / whole_data) * 100), 4)
    pie_outlier_values = round(((outlier_count / whole_data) * 100), 4)
    pie_clean_data = round(((clean_data / whole_data) * 100), 4)
    
    table_titles = ['Total Data', 'Negative Value Counts', 'Missing Values / NaN Values', 'Outliers Detected', 'Normal Data']
    table_values = [whole_data, negative, missing_values, outlier_count, clean_data]

    pie_titles = ['Negative Values', 'Missing Values / NaN Values', 'Outliers Detected', 'Normal Data']
    pie_values = [pie_negative_value, pie_missing_values, pie_outlier_values, pie_clean_data]

    phosphorus_data_cleaning = {'TABLE_LABELS': 'DATA INSIGHTS FOR PHOSPHORUS PREDICTION (in numbers)', 
                                'TABLE_TITLES': table_titles,
                                'TABLE_VALUES': table_values,
                                'PIE_CHART_LABELS': 'DATA INSIGHTS FOR PHOSPHORUS PREDICTION (in percentage)',
                                'PIE_CHART_TITLES': pie_titles,
                                'PIE_CHART_VALUES': pie_values}

    return json.dumps(phosphorus_data_cleaning)

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
                app.config['UPLOAD_FOLDER'] = os.path.join(APP_ROOT, 'uploads', 'mri', 'Test.dcm')
            
            # Save the file
            file.save(app.config['UPLOAD_FOLDER'])
            return 'file uploaded successfully'
    return abort(406)

@app.route('/dashboard')
def dashboard():
    blog_link = ['http://mindbowser.com/machine-learning-future-in-finance/', 'http://mindbowser.com/supply-chain-and-logistics/', 'http://mindbowser.com/solve-agricultural-problems-using-machine-learning/', 'http://mindbowser.com/wonders-machine-learning-can-do-for-industries/']
    blog_header = ['The future of Machine Learning in Finance', 'Machine learning - A giant Leap in Supply chain and Logistics', 'Challenges faced in agriculture and how machine learning can be applied', 'Wonders Machine Learning can do for Industries']
    blog_image = ['D:/ml-backend/images/business-chart-1.jpg', 'D:/ml-backend/images/boats-cargo-container.jpg', 'D:/ml-backend/images/pexels-photo-616020.jpeg', 'D:/ml-backend/images/ML-1.png']
    workflow_image = ['D:/ml-backend/images/Machine-Leaning-Workflow-v-3.png']
    news_link = ['http://news.mit.edu/2018/revolutionizing-everyday-products-with-artificial-intelligence-mit-meche-0601', 'http://news.mit.edu/2018/applying-machine-learning-to-challenges-in-pharmaceutical-industry-0517', 'http://news.mit.edu/2018/ml-20-machine-learning-many-data-science-0306']
    news_header = ['Revolutionizing everyday products with artificial intelligence', 'Applying machine learning to challenges in the pharmaceutical industry', 'Machine learning for many']

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
    sourceImage = os.path.join(APP_ROOT, 'uploads', 'mri', 'Test.dcm')
    destImage = os.path.join(APP_ROOT, 'uploads', 'converted', 'Test.png')
    try:
        os.remove(destImage)
    except OSError:
        pass
    # Convert the MRI file to PNG file
    mritopng.convert_file(sourceImage, destImage)
    return send_file(destImage, mimetype='image/png')


@app.route('/showFiles')
def showFiles():
    current_tab_param = "sensor_anomaly"
    onlyfiles = [f for f in listdir("datasource/"+current_tab_param) if isfile(join("datasource/"+current_tab_param, f))]
    return onlyfiles

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5050))
    app.run(host='0.0.0.0', port=port, debug=True, use_reloader=True)

