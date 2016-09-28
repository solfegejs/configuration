solfegejs-configuration
-----------------------

Configuration manager for SolfegeJS

Installation
------------

The bundle is included by default in SolfegeJS. You don't need to install it.

See [SolfegeJS](https://github.com/neolao/solfege/)


Usage
-----

The bundle provides a YAML loader for configuration files.

```javascript
import solfege from "solfegejs";
import MyBundle from "./MyBundle";

// Create application
let application = solfege.factory();
application.addBundle(new MyBundle);

// Load configuration
application.loadConfigurationFile(`${__dirname}/config/production.yml`, "yaml");
```
