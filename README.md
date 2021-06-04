# fspress - FileSystem driven ExpressJS [WIP]

fspress is a small library for quickly creating ExpressJS backends that uses filesystem paths for route definitions. Inspired from [cli-api-mocker](/muratcorlu/cli-api-mocker)

* Zero boilerplate
* Very easy to create REST APIs
* Simple REST API mocks with proxy support
* Easyly create template driven websites

## Installation

Install fspress globally with

    npm i -g fspress


## Usage

Create your routes with a folder structure like:

```
messages
  \_ :messageId
  |     \_ GET.json
  |     \_ GET.html
  \_ POST.js
  \_ GET.js
  \_ GET.html
index.html
```

If you run `flash` command in main folder of this project;

`GET localhost:3000/` request (with `Accept: text/html` header) will return rendered result of `./index.html`
`GET localhost:3000/messages/23123` request (with `Accept: text/html` header) will return rendered result of `./messages/:messageId/GET.html`
`GET localhost:3000/messages/53242` request (with `Accept: application/json` header) will return content of `./messages/:messageId/GET.json`
`POST localhost:3000/messages` request will be responded by express middleware exported in `./messages/POST.js`. Example:

```js
module.exports = (req, res) => {
    res.json({message: "Hello World!"});
}
```

Main schema is `[METHOD] localhost:3000/[PATH]` goes to file `{BASEPATH}[PATH]/[METHOD].(js|json|html|xml|png|...)` Correct file type to respond request will be decided regarding to `Accept` request header.

More information will come...
