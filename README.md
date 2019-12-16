# Nodejs library to use Google Cloud secret manager
> https://cloud.google.com/secret-manager/docs/

```bash
npm install --save gcp-secret-manager
```

```javascript
import { getSecrets } from 'gcp-secret-manager';

await secretsManager.getSecrets('your-project-id', [
  'FOO',
  'BAR'
]);

// procces.env.FOO gets set to your value stored in secret manager

```
