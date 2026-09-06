targetScope = 'resourceGroup'

@description('Azure region for the monitoring resources.')
param location string = resourceGroup().location

@description('Public production URL checked by the disabled availability test.')
param siteUrl string = 'https://jayaprakashkupparaju.com/'

param workspaceName string = 'log-personal-site-prod'
param applicationInsightsName string = 'appi-personal-site-prod'
param webTestName string = 'webtest-personal-site-prod'
param actionGroupName string = 'ag-personal-site-prod'
param alertRuleName string = 'alert-personal-site-unavailable'
param automationAccountName string = 'aa-personal-site-guard'

var commonTags = {
  project: 'personal-site-sre-lab'
  environment: 'production'
  purpose: 'observability-learning'
  costControl: 'annual-budget-under-10-usd'
}

resource workspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: workspaceName
  location: location
  tags: commonTags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    workspaceCapping: {
      dailyQuotaGb: json('0.023')
    }
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: applicationInsightsName
  location: location
  tags: commonTags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: workspace.id
    RetentionInDays: 30
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

resource webTest 'Microsoft.Insights/webTests@2022-06-15' = {
  name: webTestName
  location: location
  tags: union(commonTags, {
    'hidden-link:${applicationInsights.id}': 'Resource'
  })
  kind: 'standard'
  properties: {
    SyntheticMonitorId: webTestName
    Name: webTestName
    Description: 'Cost-controlled production website availability learning test'
    Enabled: false
    Frequency: 900
    Timeout: 30
    Kind: 'standard'
    RetryEnabled: true
    Locations: [
      {
        Id: 'us-tx-sn1-azr'
      }
    ]
    Request: {
      RequestUrl: siteUrl
      HttpVerb: 'GET'
      FollowRedirects: true
      ParseDependentRequests: false
    }
    ValidationRules: {
      ExpectedHttpStatusCode: 200
      SSLCheck: true
      SSLCertRemainingLifetimeCheck: 7
    }
  }
}

resource actionGroup 'Microsoft.Insights/actionGroups@2023-01-01' = {
  name: actionGroupName
  location: 'Global'
  tags: commonTags
  properties: {
    groupShortName: 'site-sre'
    enabled: true
    armRoleReceivers: [
      {
        name: 'SubscriptionOwner'
        roleId: '8e3af657-a8ff-443c-a75c-2fe8c4bcb635'
        useCommonAlertSchema: true
      }
    ]
  }
}

resource availabilityAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: alertRuleName
  location: 'Global'
  tags: commonTags
  properties: {
    description: 'Alerts during the supervised production availability lab'
    severity: 1
    enabled: false
    scopes: [
      webTest.id
      applicationInsights.id
    ]
    evaluationFrequency: 'PT5M'
    windowSize: 'PT15M'
    criteria: {
      'odata.type': 'Microsoft.Azure.Monitor.WebtestLocationAvailabilityCriteria'
      webTestId: webTest.id
      componentId: applicationInsights.id
      failedLocationCount: 1
    }
    actions: [
      {
        actionGroupId: actionGroup.id
      }
    ]
  }
}

resource automationAccount 'Microsoft.Automation/automationAccounts@2023-11-01' = {
  name: automationAccountName
  location: location
  tags: commonTags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    sku: {
      name: 'Basic'
    }
    publicNetworkAccess: true
  }
}

var monitoringContributorRoleId = subscriptionResourceId(
  'Microsoft.Authorization/roleDefinitions',
  '749f88d5-cbae-40b8-bcfc-e573ddc772fa'
)

resource webTestGuardRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(webTest.id, automationAccount.id, monitoringContributorRoleId)
  scope: webTest
  properties: {
    principalId: automationAccount.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: monitoringContributorRoleId
  }
}

output webTestResourceName string = webTest.name
output automationAccountResourceName string = automationAccount.name
output actionGroupResourceName string = actionGroup.name
output alertRuleResourceName string = availabilityAlert.name
