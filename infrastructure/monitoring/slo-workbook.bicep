targetScope = 'resourceGroup'

@description('Azure region for the shared Workbook resource.')
param location string = resourceGroup().location

@description('Display name shown in Azure Monitor Workbooks.')
param workbookDisplayName string = 'workbook-personal-site-slo'

@description('Existing Log Analytics workspace queried by the Workbook.')
param workspaceName string = 'log-personal-site-prod'

var commonTags = {
  project: 'personal-site-sre-lab'
  environment: 'production'
  purpose: 'slo-learning-dashboard'
  costControl: 'on-demand-queries-only'
}

resource workspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' existing = {
  name: workspaceName
}

resource sloWorkbook 'Microsoft.Insights/workbooks@2023-06-01' = {
  name: guid(resourceGroup().id, workbookDisplayName)
  location: location
  kind: 'shared'
  tags: commonTags
  properties: {
    displayName: workbookDisplayName
    description: 'Laboratory SLI, SLO, and error-budget dashboard for the production website'
    category: 'workbook'
    sourceId: workspace.id
    version: '1.0'
    serializedData: replace(
      loadTextContent('slo-workbook.json'),
      '__WORKSPACE_RESOURCE_ID__',
      workspace.id
    )
  }
}

output workbookName string = sloWorkbook.name
output workbookDisplayName string = sloWorkbook.properties.displayName
output workbookResourceId string = sloWorkbook.id
