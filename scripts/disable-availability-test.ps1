param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string] $ResourceGroupName,

    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string] $WebTestName
)

$ErrorActionPreference = 'Stop'
$null = Disable-AzContextAutosave -Scope Process
$context = (Connect-AzAccount -Identity).Context
$context = Set-AzContext -SubscriptionId $context.Subscription.Id -DefaultProfile $context
$subscriptionId = $context.Subscription.Id

$resourcePath = "/subscriptions/$subscriptionId/resourceGroups/$ResourceGroupName/providers/Microsoft.Insights/webtests/$WebTestName"
$apiVersion = '2022-06-15'
$response = Invoke-AzRestMethod `
    -Method GET `
    -Path "$resourcePath`?api-version=$apiVersion" `
    -DefaultProfile $context
$webTest = $response.Content | ConvertFrom-Json

if (-not $webTest.properties.Enabled) {
    Write-Output "Availability test is already disabled."
    return
}

$webTest.properties.Enabled = $false
$payload = $webTest | ConvertTo-Json -Depth 20
$null = Invoke-AzRestMethod `
    -Method PUT `
    -Path "$resourcePath`?api-version=$apiVersion" `
    -Payload $payload `
    -DefaultProfile $context

$verification = Invoke-AzRestMethod `
    -Method GET `
    -Path "$resourcePath`?api-version=$apiVersion" `
    -DefaultProfile $context
$verifiedWebTest = $verification.Content | ConvertFrom-Json

if ($verifiedWebTest.properties.Enabled) {
    throw 'Cost guard failed: the availability test is still enabled.'
}

Write-Output "Cost guard verified that the availability test is disabled."
