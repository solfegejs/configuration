import Application from "solfegejs-application";
import ConfigurationBundle from "../../lib/Bundle";
import MyBundle from "./Bundle";

// Create application instance
let application = new Application;
application.addBundle(new ConfigurationBundle);
application.addBundle(new MyBundle);

application.setConfigurationFile(`${__dirname}/config/production.yml`, "yaml");

// Start the application
let parameters = process.argv.slice(2);
application.start(parameters);
