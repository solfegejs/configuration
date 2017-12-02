import solfege from "solfegejs";
import ConfigurationBundle from "../../lib/Bundle";
import MyBundle from "./Bundle";

// Create application instance
let application = solfege.factory();
application.addBundle(new ConfigurationBundle);
application.addBundle(new MyBundle);

application.setConfigurationFile(`${__dirname}/config/production.yml`, "yaml");

// Start the application
let parameters = process.argv.slice(2);
application.start(parameters);
