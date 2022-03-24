# Green Knight plugin

This plugin makes it easy to embed a user's balance check into your web application. It can be useful if you want to restrict access to parts of your application to users with a sufficient number of targeted FA1.2 or FA2 tokens.

## How to use plugin

To use the plugin, first include the plugin script:

```html
<script src="https://raw.githubusercontent.com/nikitaGetman/green-knight-tezos/master/plugin/src/green-knight-plugin.js"></script>
```

After loading the script, the global `GreenKnightPlugin` object will be available. Call the constructor and pass the code of your authorization rule created using the Green Knight web application.

```javascript
new GreenKnightPlugin()
  .test(`<SECURE LINK ID>`) // you will get ID when create secure link on web app
  .then(() => {
    // user has required tokens
    console.log("Ok");
  })
  .catch((e) => {
    // user does not have required tokens
    console.log("Insufficient balance", e);
  });
```
