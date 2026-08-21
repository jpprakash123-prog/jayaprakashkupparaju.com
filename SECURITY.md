# Security Policy

## Sensitive Information

Passwords, credentials, authentication tokens, API keys, deployment tokens,
private keys, usernames, email addresses, Azure subscription or tenant IDs, and
other personal or sensitive information must not be committed to this
repository.

Use placeholders in tracked files, such as:

```text
<AZURE_SUBSCRIPTION_ID>
<AZURE_TENANT_ID>
<USERNAME>
```

Runtime secrets must be stored in an appropriate secret store, such as GitHub
Actions encrypted secrets or Azure Key Vault. Authentication values used by
local tools should remain in process memory or in the tool's protected local
credential store.

## Before Committing or Pushing

1. Review the staged diff.
2. Scan staged content for credentials and sensitive identifiers.
3. Confirm that configuration and documentation contain placeholders rather
   than real values.
4. Do not push until any detected sensitive information has been removed.

If sensitive information is committed accidentally, treat it as exposed:
revoke or rotate the affected credential immediately, remove it from the
repository and its history where necessary, and document the response without
reproducing the sensitive value.
