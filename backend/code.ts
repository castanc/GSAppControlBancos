import { DateHelper } from "../models/DateHelper";
import { GSResponse } from "../Models/GSResponse";
import { KVPCollection } from "../models/KVPCollection";
import { RecordItem } from "../models/RecordItem";
import { Service } from "./service";
import { SysLog } from "./SysLog";
import { Utils } from "./Utils";


function testReport()
{
    let data = new KVPCollection();
    data.add("REC_TYPE","REP");
    data.add("REC_FILTER","ANDA");
    data.add("FECHA_DESDE","2021-01-01");
    data.add("FECHA_HASTA","2021-02-13");
    let sv = new Service();
    let result = sv.report(data);
    
}
function testImportBatchANDA()
{
    let sv = new Service();
    let result = sv.importBatchANDA("ANDA","https://docs.google.com/spreadsheets/d/14gZJUwIOrXKK4sAsWytAumB0iLm9WUWNk3HmFTnqbVQ/edit#gid=0");
}




function testDateHelper() {
    let dth = new DateHelper();
    dth = dth.getFromDMYHMS("29/01/2021");
    Logger.log(dth);
}


function testGetItems() {
    let sv = new Service();
    let result = sv.getItems();
}




function testGetId() {
    let sv = new Service();
    let result = sv.getId("Id");
}


function log(msg, data) {
    SysLog.log(0, msg, "code.ts log()", data);
}

function edit(year) {

    let sv = new Service();
    let response = new GSResponse();
    try {
        response = sv.edit(year);
    }
    catch (ex) {
        handleException(ex, "edit()", year.toString());
    }
    return JSON.stringify(response);
}

function getDataDeclarations(names): string {
    let sv = new Service();
    return sv.getDataDeclarations(names);
}

/* @Include JavaScript and CSS Files */
function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename)
        .getContent(); 303
}

function doGet(e) {
    return HtmlService.createTemplateFromFile('frontend/index').evaluate();
}

function getSportTypes() {
    let sv = new Service();
    let html = sv.getHtmlSelectFiltered("Items", "SP", "Select Sport", "", true);
    return html;

}

function getEvents() {
    let sv = new Service();
    let html = sv.getHtmlSelectFiltered("Items", "EV", "Select Event", "", true);
    return html;

}

function getDrugItems() {
    let sv = new Service();
    let response = new GSResponse();
    let json = "";
    try {
        json = sv.getDrugItems();
        SysLog.log(0, "DrugItems", "code.ts getDrugItems()", json);
        response.addData("DrugItems", json)
    }
    catch (ex) {
        handleException(ex, response, "code.ts getFoodItems()")
    }
    return json;    //JSON.stringify(response);
}



function getExeItems() {
    let sv = new Service();
    let response = new GSResponse();
    let json = "";
    try {
        json = sv.getExeItems();
        response.addData("ExeItems", json)
    }
    catch (ex) {
        handleException(ex, response, "code.ts getExeItems()")
    }
    return json;    //JSON.stringify(response);
}



function getRecTypes() {
    let sv = new Service();
    let html = sv.getHtmlSelectFiltered("Items", "RT", "Select Record Type", "", true);
    return html;
}

function getFoodItems() {
    let sv = new Service();
    let response = new GSResponse();
    let json = "";
    try {
        json = sv.getFoodItems();
        SysLog.log(0, "FoodItems", "code.ts getFoodItems()", json);
        response.addData("FoodItems", json)
    }
    catch (ex) {
        handleException(ex, response, "code.ts getFoodItems()")
    }
    return json;    //JSON.stringify(response);
}




function getPageArr() {
    return "";
}


function getFileInfo(url)
{
    let response = new GSResponse();
    try {
        let sv = new Service();
        response = sv.getFileInfo(url);
    }
    catch (ex) {
        handleException(ex, response, "getFileInfo");
    }
    return JSON.stringify(response);    
}

function report(Data){
    SysLog.log(0,"","code.ts report()",JSON.stringify(Data));
    let response = new GSResponse();
    try {
        let sv = new Service();
        response = sv.report(Data);
    }
    catch (ex) {
        handleException(ex, response, "report");
    }
    return JSON.stringify(response);        
}


function processForm(Data, records, colSep = "\t", lineSep = "\n") {

    let sv = new Service();
    let html = "";
    let result = new GSResponse();
    try {
        result = sv.processForm(Data, records, colSep, lineSep);
        if (result.id >= 0) {
            result.domainResult = 0;
            result.messages.push(`Record was added with id: ${result.id}`);
        }
        else {
            result.domainResult = -1;
            result.id = -1;
        }
    }
    catch (ex) {
        SysLog.logException(ex, "processForm()");
        result.addError("error", ex.message);
        result.messages.push(ex.message);
        result.messages.push(ex.stack);
        result.showModal = false;
    }
    SysLog.log(9999, "esponse", "processFOrm()", JSON.stringify(result));
    return JSON.stringify(result);
}


function getSelectArr() {
    return "";
}


function getItems() {
    let sv = new Service();
    return sv.getItems();
}

function handleException(ex, response, method = "", additional = "") {
    response.result = 500;
    response.addError("Exception", ex.message);
    response.addError("StackTrace", ex.stack);
    response.addError("method", method);
    response.addError("additional", additional);

    SysLog.logException(ex, method, additional)
}

function getForm(controlId, formId, formUrl): string {
    var response = new GSResponse();

    response.controlId = controlId;
    response.formId = formId;

    try {
        let sv = new Service();
        response = sv.getForm(formId, formUrl);
    }
    catch (ex) {
        handleException(ex, response, "code.ts getForm()")
    }
    return JSON.stringify(response);
}




