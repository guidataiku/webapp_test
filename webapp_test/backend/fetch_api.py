import dataiku
from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import pandas as pd
import numpy as np

fetch_api = Blueprint("fetch_api", __name__, url_prefix="/api")

@fetch_api.route("/products", methods=["GET"])
def get_products():
    # code
    # return array of products
    return jsonify(['avastin'])

@fetch_api.route("/products/<string:product_id>/campaigns", methods=["GET"])
def get_campaigns_by_product(product_id):
    # code
    ds_campaigns= dataiku.Dataset('BSLAVOUSP_FEA_MODEL_PCV_N_1')
    df_campaigns = ds_campaigns.get_dataframe(columns=['API_BATCH', 'N_1_START_TIME_UTC'])

    # Transform N_1_START_TIME_UTC to AVO_YEAR_MONTH
    df_campaigns['N_1_START_TIME_UTC'] = pd.to_datetime(df_campaigns['N_1_START_TIME_UTC'])
    df_campaigns['AVO_YEAR_MONTH'] = 'AVO_' + df_campaigns['N_1_START_TIME_UTC'].dt.year.astype(str) + '_' + df_campaigns['N_1_START_TIME_UTC'].dt.month.astype(str)

    # Filter for unique campaigns
    unique_campaigns = df_campaigns['AVO_YEAR_MONTH'].unique().tolist()

    # return array of campaigns
    return jsonify(unique_campaigns)

@fetch_api.route("/products/<string:product_id>/batches_by_campaigns", methods=["POST"])
def get_batches_by_campaigns(product_id):
    req_data = request.get_json(force=True)
    campaigns_req = req_data.get('campaigns')

    # Fetch data
    ds_campaigns= dataiku.Dataset('BSLAVOUSP_FEA_MODEL_PCV_N_1')
    df_campaigns = ds_campaigns.get_dataframe(columns=['API_BATCH', 'N_1_START_TIME_UTC'])

    # Transform N_1_START_TIME_UTC to AVO_YEAR_MONTH
    df_campaigns['N_1_START_TIME_UTC'] = pd.to_datetime(df_campaigns['N_1_START_TIME_UTC'])
    df_campaigns['AVO_YEAR_MONTH'] = 'AVO_' + df_campaigns['N_1_START_TIME_UTC'].dt.year.astype(str) + '_' + df_campaigns['N_1_START_TIME_UTC'].dt.month.astype(str)

    # Filter batches by campaigns
    filtered_batches = df_campaigns[df_campaigns['AVO_YEAR_MONTH'].isin(campaigns_req)]['API_BATCH'].tolist()

    # Return array of batch_ids
    return jsonify(filtered_batches)

@fetch_api.route("/products/<string:product_id>/batches_by_date", methods=["GET"])
def get_batches_by_date(product_id):
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    interval = request.args.get('interval')
    
    if start_date and end_date:
        try:
            # Transform start_date and end_date to datetime objects
            start_date = datetime.strptime(start_date, "%Y-%m-%d")
            end_date = datetime.strptime(end_date, "%Y-%m-%d")

            # Transform to ISO format 
            start_date = start_date.isoformat()
            end_date = end_date.isoformat()
        except ValueError:
            return "Incorrect date format, should be YYYY-MM-DD."

    # handle the interval parameter
    if interval:
        if interval == 'last_week':
            start_date = datetime.now() - timedelta(weeks=1)
        elif interval == 'last_month':
            start_date = datetime.now() - timedelta(days=30)
        elif interval == 'last_3_months':
            start_date = datetime.now() - timedelta(days=90)
        else:
            raise ValueError(f"Invalid interval value: {interval}")
        end_date = datetime.now()

  

    ds_batches= dataiku.Dataset('BSLAVOUSP_FEA_MODEL_PCV_N_1')
    df_batches = ds_batches.get_dataframe(columns=['API_BATCH', 'N_1_START_TIME_UTC'])
    print('start', end_date)
    # convert N_1_START_TIME_UTC to datetime
    df_batches['N_1_START_TIME_UTC'] = pd.to_datetime(df_batches['N_1_START_TIME_UTC'])

    # filter batches based on date range
    filtered_batches = df_batches[(df_batches['N_1_START_TIME_UTC'] >= start_date) & (df_batches['N_1_START_TIME_UTC'] <= end_date)]

    # return the list of batch ids
    batch_list = filtered_batches['API_BATCH'].tolist()
    return jsonify(batch_list)

@fetch_api.route("/products/<string:product_id>/batches_by_id", methods=["GET"])
def get_batches_by_id(product_id):
    batch_ids = request.args.getlist('id') # get list of 'id' parameters

    # fetch batches data
    ds_batches = dataiku.Dataset('BSLAVOUSP_FEA_MODEL_PCV_N_1')
    df_batches = ds_batches.get_dataframe(columns=['API_BATCH', 'N_1_START_TIME_UTC'])

    # filter for the batches with given ids
    filtered_batches = df_batches[df_batches['API_BATCH'].isin(batch_ids)]

    # return the batch info
    return jsonify(filtered_batches['API_BATCH'].tolist())

@fetch_api.route("/products/<string:product_id>/batches", methods=["GET"])
def get_batches_by_product(product_id):
   
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    interval = request.args.get('interval')
    dates_provided = bool(start_date) and bool(end_date)
    
    if start_date and end_date:
        try:
            # Transform start_date and end_date to datetime objects
            start_date = datetime.strptime(start_date, "%Y-%m-%d")
            end_date = datetime.strptime(end_date, "%Y-%m-%d")

            # Transform to ISO format 
            start_date = start_date.isoformat()
            end_date = end_date.isoformat()
        except ValueError:
            return "Incorrect date format, should be YYYY-MM-DD."
 
    # handle the interval parameter
    if interval:
        if interval == 'last_week':
            start_date = datetime.now() - timedelta(weeks=1)
        elif interval == 'last_month':
            start_date = datetime.now() - timedelta(days=30)
        elif interval == 'last_3_months':
            start_date = datetime.now() - timedelta(days=90)
        end_date = datetime.now()
        dates_provided = True
 
    table = 'fea_pcv_n3_batches_complete'
       
    ds_batches = dataiku.Dataset(table)
    df_batches = ds_batches.get_dataframe()
 
    # Convert n_X_start_time_utc to datetime
    df_batches['n_3_start_time_utc'] = pd.to_datetime(df_batches['n_3_start_time_utc'])
    df_batches['n_3_start_time_utc'] = df_batches['n_3_start_time_utc'].dt.tz_convert(None)
    # Apply date filter
    if dates_provided:
        df_batches = df_batches[
            (df_batches['n_3_start_time_utc'] >= start_date) &
            (df_batches['n_3_start_time_utc'] <= end_date)
        ]
 
    df_batches = df_batches[['api_batch']]
    df_batches.rename(columns={'api_batch': 'batch_id'}, inplace=True)
    # return the list of batch ids
    return df_batches.to_json(orient='records')

@fetch_api.route("/products/<string:product_id>/parameters", methods=["POST"])
def get_parameters_by_data(product_id):
    # params -> ['referenceSet', 'studySet']
    # code
    return jsonify([])

@fetch_api.route("/products/<string:product_id>/ranked_parameters", methods=["POST"])
def get_ranked_parameters_by_data(product_id):
    # params -> ['referenceSet', 'studySet', 'parameters']
    # code
    return jsonify([])

# here starts pcv model insights
@fetch_api.route("/pcv-model-insights/<string:product_id>/phases", methods=["get"])
def get_phases_for_product(product_id):
    return jsonify([{ 'phaseId': 'seed', 'title': 'Seed', 'disabled': bool(1)}, { 'phaseId': 'n-3', 'title': 'N-3', 'disabled': bool(0)}, { 'phaseId': 'n-2', 'title': 'N-2', 'disabled': bool(0)}, { 'phaseId': 'n-1', 'title': 'N-1', 'disabled': bool(0)}, { 'phaseId': 'prod', 'title': 'Prod', 'disabled': bool(1)}])

@fetch_api.route("/pcv-model-insights/<string:product_id>/<string:phase_id>/batches", methods=["get"])
def get_batches_for_product_phase(product_id, phase_id):

    # phase_ids mapping to datasets
    datasets = {
        'n-1': 'FEA_PCV_N1_BATCHES_COMPLETE_PREPARED_JOINED_PREPARED',
        'n-2': 'FEA_PCV_N2_BATCHES_COMPLETE_PREPARED_JOINED_PREPARED',
        'n-3': 'SELECT_BATCHES_N_3_ANOMALIES_FLAG'
    }

    # Make sure phase_id is valid
    if phase_id not in datasets.keys():
        return "Invalid phase_id", 400

     # Get the phase_id dataset
    ds_batches = dataiku.Dataset(datasets[phase_id])
    df_batches = ds_batches.get_dataframe()
    
    column_mapping = {
        'api_batch': 'batch_id',
        'prediction_10hr': 'predicted_pcv_10h',
        'prediction_60hr': 'predicted_pcv_60h',
        'outlier': 'outlier_flag'
    }

    formatted_phase_id = 'n_' + phase_id.split('-')[-1]
    column_mapping[f'fea_{formatted_phase_id}_pcv_end'] = 'measured_pcv'

    df_batches = df_batches.rename(columns=column_mapping)
    
    # Convert df to CSV
    return df_batches.to_json(orient='records')

@fetch_api.route("/pcv-model-insights/<string:product_id>/<string:phase_id>/parameters", methods=["get"])
def get_parameters_for_product_phase(product_id, phase_id):
    # phase_ids mapping to datasets
    datasets = {
        'n-1': 'FEA_PCV_N1_BATCHES_COMPLETE_PREPARED_JOINED_PREPARED',
        'n-2': 'FEA_PCV_N2_BATCHES_COMPLETE_PREPARED_JOINED_PREPARED',
        'n-3': 'SELECT_BATCHES_N_3_ANOMALIES_FLAG'
    }
    # Map phase_ids to columns
    columns = {
        'n-1': ['fea_n_2_pco2_end', 'fea_n_1_pcv_beg', 'fea_n_1_air_value_at_10_hour', 'fea_n_1_o2_value_at_60_hour', 'fea_n_1_last_sample_duration_hours'],
        'n-2': ['fea_n_2_ph_beg', 'fea_n_2_od_ln_intercept_h_0_10', 'fea_n_2_od_ln_slope_h_0_10', 'fea_n_2_od_ln_intercept_h_0_60', 'fea_n_2_od_ln_slope_h_0_60', 'fea_n_2_air_value_at_10_hour', 'fea_n_2_last_sample_duration_hours'],
        'n-3': ['fea_n_3_last_sample_duration_hours', 'fea_n_4_lactate_end','fea_n_4_pcv_end', 'fea_n_3_air_value_at_5_hour']
    }

    # Check if the phase_id is valid
    if phase_id not in datasets.keys():
        return "Invalid phase_id", 400

    # Get the corresponding dataset
    ds_batches = dataiku.Dataset(datasets[phase_id])
    df_batches = ds_batches.get_dataframe()

    # Subset the DataFrame with only the wanted columns
    df_batches = df_batches[columns[phase_id]]
    
    # Transform column names to uppercase for matching with global variable keys
    #df_batches.columns = df_batches.columns.str.upper()

    #global_vars = dataiku.get_custom_variables()
    #var_mapping = global_vars['INPUT_FEATURES_LABELS_PCV']
    
    # Select only those keys from var_mapping that exist in df_batches columns
    #selected_mapping = {k: v for k, v in var_mapping.items() if k in df_batches.columns}

    # Convert the selected mapping dict to a df
    #df_description = pd.DataFrame(list(selected_mapping.items()), columns=['parameter_id', 'description'])

    
    # Create the output DataFrame with technical names for now
    df_description = pd.DataFrame(df_batches.columns, columns=['parameter_id'])
    df_description['description'] = df_description['parameter_id']  
    
    return df_description.to_json(orient='records')

@fetch_api.route("/pcv-model-insights/<string:product_id>/<string:phase_id>/parameters/<string:parameter_id>", methods=["get"])
def get_data_for_product_phase_parameter(product_id, phase_id, parameter_id):
    # phase_ids mapping to datasets
    datasets = {
        'n-1': 'FEA_PCV_N1_BATCHES_COMPLETE_PREPARED_JOINED_PREPARED',
        'n-2': 'FEA_PCV_N2_BATCHES_COMPLETE_PREPARED_JOINED_PREPARED',
        'n-3': 'SELECT_BATCHES_N_3_ANOMALIES_FLAG'
    }
    
    # Check if the phase_id is valid
    if phase_id not in datasets.keys():
        return "Invalid phase_id", 400

    # Get the global variable (same as before)
    #global_vars = dataiku.get_custom_variables()
    #var_mapping = global_vars['INPUT_FEATURES_LABELS_PCV']
    
    # Create a dictionary that maps parameter_id (description) to feature name (original column name)
    #inv_var_mapping = {v: k for k, v in var_mapping.items()}

    # Translate parameter_id to original column name
    #original_col_name = inv_var_mapping.get(parameter_id)
    #if original_col_name is None:
    #    return f"Invalid parameter_id: {parameter_id}", 400

    ds = dataiku.Dataset(datasets[phase_id])
    df = ds.get_dataframe()

    # Extract the data corresponding to the selected parameter (making sure the column exists in the dataframe)
    #if original_col_name in df.columns:
    #    result_df = df[[original_col_name]].copy()
    #else:
    #    return f"No data found for parameter_id: {parameter_id}", 400

    # Calculate the pdf
    #weights, bin_edges = np.histogram(result_df[original_col_name], density=True)

    # Assign density values to the corresponding bin
    #result_df['density'] = np.zeros_like(result_df[original_col_name])
    
    #for i in range(len(weights)):
    #    result_df.loc[(result_df[original_col_name] >= bin_edges[i]) & 
    #                  (result_df[original_col_name] < bin_edges[i+1]), 
    #                  'density'] = weights[i]
    
   #Using technical name directly
    if parameter_id in df.columns:
        result_df = df[[parameter_id]].copy()
    else:
        return f"No data found for parameter_id: {parameter_id}", 400

    # Calculate the pdf
    weights, bin_edges = np.histogram(result_df[parameter_id], density=True)

    # Assign density values to the corresponding bin
    result_df['density'] = np.zeros_like(result_df[parameter_id])
    
    for i in range(len(weights)):
        result_df.loc[(result_df[parameter_id] >= bin_edges[i]) & 
                      (result_df[parameter_id] < bin_edges[i+1]), 
                      'density'] = weights[i]
        
    result_df.columns = ["x", "y"]
    result_df = result_df.sort_values(by=['x'])

    return result_df.to_json(orient='records')