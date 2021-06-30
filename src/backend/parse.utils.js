import Parse from 'parse/dist/parse.min.js';

Parse.initialize("3TXfLRqRsA4QctqRPKuUpShV3SuxMBILXO2NuCXy", "H6IW4jJTAMGy8LjH0nZnjJUR3acIDnViLT6AXTyp");
Parse.serverURL = 'https://parseapi.back4app.com/'

Parse.User.enableUnsafeCurrentUser();

export default Parse;