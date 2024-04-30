export const defaultEnvironment = {
    production: false,
    availableLangs: ['en', 'de'],
    defaultLang: 'en',
    availableChapters: ['operatorX', 'manufacturX'],
    defaultChapter: 'manufacturX',
    forms: {
      stability: [],
      univariety: [{
        stepname: 'Select Product Production',
        items: [
          {
              type: 'Dropdown',
              id: 'product',
              multiselect: false,
              labelBefore: 'Select the product production that you want to analyse'
          }
        ]
      }, {
        stepname: 'Select Reference vs Study Set',
        items: [
          {
            type: 'SelectBy',
            labelBefore: 'Select batches you want to analyse in detail',
            id: 'referenceSet',
            multiselect: true,
            selectBy: [
              {
                  icon: 'routine',
                  id: 'byCampaign',
                  label: 'byCampaign'
              }, {
                  icon: 'calendar_schedule',
                  id: 'byDate',
                  label: 'byDate'
              }, {
                  icon: 'factor_parallelism',
                  id: 'byId',
                  label: 'byId'
              }
            ]
          }, {
            type: 'SelectBy',
            labelBefore: 'Select batches to be used as the reference (e.g., to calculate mean)',
            id: 'studySet',
            multiselect: true,
            selectBy: [
              {
                  icon: 'routine',
                  id: 'byCampaign',
                  label: 'byCampaign'
              }, {
                  icon: 'calendar_schedule',
                  id: 'byDate',
                  label: 'byDate'
              }, {
                  icon: 'factor_parallelism',
                  id: 'byId',
                  label: 'byId'
              }
            ]
          }
        ]
      }, {
        stepname: 'Select Parameters',
        items: [
          {
            type: 'SelectBy',
            labelBefore: 'Select parameters to analyse (Max. 20)',
            id: 'parameters',
            multiselect: true,
            selectBy: [
              {
                icon: 'list_view_tiled',
                id: 'byParameters',
                label: 'byParameters'
              }
            ]
          }
        ]
      }, {
        stepname: 'Ranked Parameters',
        items: [
          {
            type: 'SelectBy',
            labelBefore: 'View Parameter Ranking and select parameters for detailed analysis',
            id: 'rankedParameters',
            multiselect: true,
            selectBy: [
              {
                icon: 'list_view_tiled',
                id: 'byRankedParameters',
                label: 'byRankedParameters'
              }
            ]
          }
        ]
      }
    ],
    bivariate: []
  },
    selectionTables: {
      byCampaign: {
        type: 'selection-table',
        params: ['product'],
        sortableColumns: ['campaign_name'],
        search: 'campaign_name',
        selectable: 'campaign_name',
        columns: ['campaign_name'],
        endpoint: {
          type: 'get',
          uri: 'api/products/${product}/campaigns'
        }
      },
      byId: {
        type: 'selection-table',
        params: ['product'],
        multiselect: true,
        sortableColumns: ['batch_id'],
        defaultSorting: ['desc'],
        search: 'batch_id',
        selectable: 'batch_id',
        columns: ['batch_id'],
        endpoint: {
          type: 'get',
          uri: 'api/products/${product}/batches'
        },
        submit: 'applySelectedBatches',
      },
      byParameters: {
        type: 'selection-tree-table',
        params: ['product', 'referenceSet', 'studySet'],
        groupColumn: '',
        multiselect: true,
        sortableColumns: ['batch_id'],
        defaultSorting: ['desc'],
        search: 'batch_id',
        selectable: 'batch_id',
        columns: ['batch_id'],
        endpoint: {
          type: 'get',
          uri: 'api/products/${product}/batches'
        },
        submit: 'applySelectedBatches',
      },
      rankedParameters: {
        params: ['product', 'referenceSet', 'studySet', 'parameters'],
        sortableColumns: ['parameter_name'],
        search: 'parameter_name',
        selectable: 'parameter_name',
        columns: ['parameter_name', 'calibration']
      }
    }
  }