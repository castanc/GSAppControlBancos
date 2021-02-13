import { DateHelper } from "../models/DateHelper";
import { DomainResponse } from "../models/DomainResponse";
import { FileInfo } from "../Models/FileInfo";
import { FileProcessItem } from "../models/FileProcessItem";
import { GlucLevel } from "../models/GlucLevel";
import { GSResponse } from "../Models/GSResponse";
import { KVPCollection } from "../models/KVPCollection";
import { NamedArray } from "../models/NamedAray";
import { RecordItem } from "../models/RecordItem";
import { RecordItemBase } from "../models/RecordItemBase";
import { RecTypeInfo } from "../models/RecTypeInfo";
import { G } from "./G";
import { SysLog } from "./SysLog";
import { Utils } from "./utils";

export class Service {
    db;
    folder;
    result = 0;
    message = "";
    ex;
    conceptos = [[]];
    dtDesde: DateHelper;
    dtHasta: DateHelper;


    constructor() {
        this.folder = Utils.getCreateFolder(G.FolderName);
        this.db = Utils.getCreateSpreadSheet(this.folder, "database", "Items,Terceros", "ID,ROW,GROUP,CODE,VALUE")
        G.DatabaseUrl = this.db.getUrl();
        SysLog.level = 0;
    }

    //build html select
    getSelect(name: string, arr: Array<Array<string>>, idCol: number = 0, valueCol: number = 1, title = "", selectedValue = "", req = false, startRow = 0): string {
        let options = "";
        let onChange = `onchange="onchange_${name}(this.options[this.selectedIndex].value)"`;

        let required = "";

        if (title.length == 0)
            title = "Select...";

        if (req)
            required = "required";

        options = `<option value="">${title}</option>`
        for (var i = startRow; i < arr.length; i++) {
            if (arr[i][idCol] == selectedValue)
                options = `${options}<option value="${arr[i][idCol]}" selected>${arr[i][valueCol]}</option>`
            else
                options = `${options}<option value="${arr[i][idCol]}">${arr[i][valueCol]}</option>`
        }

        let html = `<select name="SELECT_${name}" id="SELECT_${name}" ${required} ${onChange} class="form-control" style="font-size:28px">
        ${options}
    </select>`

        return html;

    }

    getData(tabName, title = "", startRow) {
        let grid = Utils.getData(this.db, tabName);
        let html = this.getSelect(tabName, grid, 0, 1, title, "", true, startRow);
        return html;
    }

    getHtmlSelectFiltered(tableName: string, groupId: string, title: string = "", value: string = "", required = false): string {
        let arr = new Array<Array<string>>();
        arr = Utils.getData(this.db, tableName).filter(x => x[0] == groupId);
        let html = this.getSelect(groupId, arr, 1, 2, title, value, required);
        return html;
    }

    getLogLevel(tabName): number {
        SysLog.level = 0;

        let id = 0;
        let data = Utils.getData(this.db, tabName).filter(x => x[3] == "LOGLEVEL");
        if (data.length > 0) {
            SysLog.level = data[0][4];
        }
        return SysLog.level;
    }



    getId(sheetName): number {
        let id = 0;
        let data = Utils.getData(this.db, sheetName).filter(x => x[3] == "ID");
        id = data[0][4];
        let row = data[0][1];
        id++;

        let sheet = this.db.getSheetByName(sheetName);
        let range = sheet.getDataRange();
        range.getCell(row, 5).setValue(id);

        return id;
    }


    updateId(sheetName, id): number {
        let data = Utils.getData(this.db, sheetName).filter(x => x[3] == "ID");
        let row = data[0][1];

        let sheet = this.db.getSheetByName(sheetName);
        let range = sheet.getDataRange();
        range.getCell(row, 5).setValue(id);

        return id;
    }




    getDataDeclarations(names): string {
        let nameList = names.split(',');
        let data = new Array<NamedArray>();
        let collection = new KVPCollection();
        let records = new Array<RecordItem>();
        let record = new RecordItem();




        let js = "";
        for (var i = 0; i < nameList.length; i++) {
            js = `${js}let ${nameList[i]} = ${JSON.stringify(new NamedArray(nameList[i]))};`;

        }

        //js = `${js}let record = ${JSON.stringify(record)};`;
        //js = `${js}let records = ${JSON.stringify(records)};`;
        return js;

    }

    //todo: for now get the raw array, later a typed array
    getItems(): string {
        let grid = Utils.getData(this.db, "Items");

        let js = `Items.arr = ${JSON.stringify(grid)}`;
        return js;
    }



    getFoodItems() {
        let grid = Utils.getData(this.db, "FoodItems");
        let js = JSON.stringify(grid);
        return js;
    }

    getDrugItems() {
        let grid = Utils.getData(this.db, "DrugItems");
        let js = JSON.stringify(grid);
        return js;
    }

    getExeItems() {
        let grid = Utils.getData(this.db, "ExeItems");
        let js = JSON.stringify(grid);
        return js;
    }


    getForm(formId: string, formUrl: string = ""): GSResponse {
        let html = "";
        let response = new GSResponse();
        if (formUrl == null)
            formUrl = "";

        SysLog.log(0, "formId", "service.ts getForm()", formId);
        if (html == null || html.length == 0) {
            html = HtmlService.createTemplateFromFile(`frontend/${formId}`).evaluate().getContent();
            //todo: create doc with html
        }
        if (html.length > 0) {
            response.addHtml("content", html);
        }
        else {
            this.result = -1;
            this.message = `form ${formId} not found`;
            //response.addError("error", `form ${formId} not found`, 404);
        }

        return response;
    }

    validateConcepto(conc: string): boolean {
        let result = false;
        conc = conc.toUpperCase().trim();
        if (conc.length > 0) {
            for (var i = 0; i < this.conceptos.length; i++) {
                if (conc == this.conceptos[i][4].trim().toUpperCase()) {
                    result = true;
                    break;
                }

            };
        }
        return result;
    }

    getFileInfoHTML(fi: FileInfo): string {
        let html = "";
        if (fi != null) {
            html = `
            <table>
            <tr style="background-color: blueviolet;">
                <td>File Name:</td>
                <td>${fi.name}</td>
            </tr>
            <tr>
                <td>Folder:</td>
                <td>${fi.getFirstDir()}</td>
            </tr>
            <tr>
                <td>Date Modified:</td>
                <td>${fi.dateModified}</td>
            </tr>
            <tr>
                <td>Url:</td>
                <td>${fi.url}</td>
            </tr>
        </table>            `;

        }
        else {
            html = `
            <table>
            <tr style="background-color: blueviolet;">
                <td>File Name:</td>
                <td class="text-danger">File Not Found</td>
            </tr>
        </table>            `;
        }
        return html;
    }

    getFileInfo(url) {
        let response = new GSResponse();
        let ssSource = Utils.openSpreadSheet(url);

        if (ssSource != null) {
            let ssFile = Utils.getFileByName(ssSource.getName());
            let fi = new FileInfo();
            fi.setFileInfo(ssFile);
            response.addHtml("rows", this.getFileInfoHTML(fi));

        }
        else
            response.addHtml("rows", this.getFileInfoHTML(null));

        return response;
    }

    getMoneyValue(val)
    {
        let text = Utils.replace(val,".","");
        text = Utils.replace(text,",",".");
        return text;
    }

    importBatchBROU(recType, url): FileProcessItem {

        let fileName = "";
        let lastRow = 2;
        let ss;
        let sheet;
        let range;
        let lastColumn = 0;
        let grid;
        let value;
        let v;
        let i = 0;
        let ssSource;
        let gridSource;
        let fpi = new FileProcessItem();
        let c;
        let startRow = 0;
        let dt: Date = new Date();
        let dht = new DateHelper();
        let indexComprobante = 0;
        let valor = "";
        let oldFormatDate = new Date(2019, 12, 31);



        this.conceptos = Utils.getData(this.db, "Items").filter(x => x[2] == recType);
        SysLog.log(0, "conceptos", JSON.stringify(this.conceptos));
        ssSource = Utils.openSpreadSheet(url);
        if (ssSource == null)
            return fpi;

        let ssFile = Utils.getFileByName(ssSource.getName());
        let fi = new FileInfo();
        fi.setFileInfo(ssFile);
        fpi.setFileInfo(fi);

        sheet = ssSource.getActiveSheet();
        //set format as string
        var column = sheet.getRange("A1:A");
        column.setNumberFormat("@");

        var column = sheet.getRange("C1:C");
        column.setNumberFormat("@");

        var rangeData = sheet.getDataRange();
        lastColumn = rangeData.getLastColumn();
        fpi.totalRows = rangeData.getLastRow();
        gridSource = rangeData.getValues();


        let data2 = new KVPCollection();
        data2.initialize("ROW,ID,INACTIVE,DAYS,MINUTES,FULL_MINUTES,Y,M,D,DOW,REC_TYPE,FECHA,HORA,CONCEPTO,COMPROBANTE,DEBITO,CREDITO,MONEDA");
        indexComprobante = data2.getIndex("COMPROBANTE");

        fileName = G.FileName;
        ss = Utils.getCreateSpreadSheet(this.folder, fileName, "Master,Detail", data2.getColNames());
        sheet = ss.getActiveSheet();


        range = sheet.getDataRange();
        lastColumn = range.getLastColumn();
        lastRow = range.getLastRow() + 1;
        grid = range.getValues();


        let id = this.getId("Parameters");

        SysLog.log(0, "grid", "importBatchBROU()", `grid length: ${gridSource.length} lastColumn:${lastColumn}`);
        for (i = 1; i < gridSource.length; i++) {
            try {
                c = gridSource[i];
                SysLog.log(0, `** PROCESSING ** ${i} invalid date:${dht.invalidDate}`, JSON.stringify(c));

                //if (!this.validateConcepto(c[1]))
                //    continue;

                dht = dht.getFromDMYHMS(c[0], "/");


                //todo: this doesnt work
                
                if (dht.dt == null || dht.invalidDate)
                    continue;

                dt = dht.dt;
                if (dt >= oldFormatDate) {
                    if (c[2].trim() != "") {
                        let eRow = grid.filter(x => x[indexComprobante] == `"${c[3]}"`)
                        if (eRow.length > 0) {
                            fpi.duplicates++;
                            continue;
                        }
                    }
                }



                //dht = dht.getFromDateObject(dt);
                data2.update("D", dht.D.toString());
                data2.update("M", dht.M.toString());
                data2.update("Y", dht.Y.toString());
                data2.update("DOW", dht.DOW.toString());
                data2.update("ID", id.toString());
                data2.update("ROW", lastRow.toString());
                data2.update("DAYS", dht.days.toString());
                data2.update("MINUTES", dht.minutes.toString());
                data2.update("FULL_MINUTES", dht.fullMinutes.toString());
                data2.update("FECHA", dht.dateYMD);
                data2.update("HORA", dht.hour);
                data2.update("REC_TYPE", recType);

                //todo: conceptos normalize to conceptos items, if new create it
                if (dt < oldFormatDate) {
                    let conc = this.conceptos.filter(x => x[3] == c[1]);

                    data2.update("CONCEPTO", c[1]);
                    data2.update("COMPROBANTE", c[3]);
                    if (conc.length > 0) {
                        if (conc[0][3] == "D")
                            data2.update("DEBITO", this.getMoneyValue(c[2].toString()));
                        else
                            data2.update("CREDITO", this.getMoneyValue(c[2].toStrig()));
                    }
                    else {
                        data2.update("DEBITO", this.getMoneyValue(c[2].toString()));
                        data2.update("CREDITO", "");
                    }
                }
                else {

                    data2.update("CONCEPTO", c[1]);
                    if (c[3].length == 0)
                        data2.update("COMPROBANTE", "");
                    else
                        data2.update("COMPROBANTE", `"${c[3]}"`);

                    data2.update("DEBITO", c[5]);
                    data2.update("CREDITO", c[6]);
                }

                let r = new RecordItemBase();
                r.id = id;

                data2.update("REC_TYPE", recType);

                v = data2.getColValues().split(",");


                sheet.appendRow(v);
                id++;
                lastRow++;
            }
            catch (ex) {
                fpi.failRows++;
                fpi.failRow = i;
                fpi.error = ex.message;
                SysLog.logException(ex,"importBatchBROU()",JSON.stringify(c));
                //break;
                throw ex;
            }

        }

        id--;
        this.updateId("Parameters", id);
        SysLog.log(0, "load process finished");

        Logger.log("RETURNING...");
        return fpi;
    }



    renderBatchResults(fpi: FileProcessItem): string {
        let html = `<table>
        <tr>
            <td>File Name:</td>
            <td>${fpi.fi.name}</td>
        </tr>
        <tr>
            <td>Folder:</td>
            <td>${fpi.fi.getFirstDir()}</td>
        </tr>
        <tr>
            <td>Date Modified:</td>
            <td>${fpi.fi.dateModified.toString()}</td>
        </tr>
        <tr>
            <td>Total Rows:</td>
            <td>${fpi.totalRows}</td>
        </tr>
        <tr>
            <td>OK Rows:</td>
            <td>${fpi.okRows}</td>
        </tr>
        <tr>
            <td>Fail Rows:</td>
            <td>${fpi.failRows}</td>
        </tr>
        <tr>
            <td>Duplicates</td>
            <td>${fpi.duplicates}</td>
        </tr>
    
    </table>
        `;

        return html;
    }


    edit(year) {
        let response = new GSResponse();
        let fileName = `${year}_data`;
        let ss = Utils.openSpreadSheet(fileName, this.folder);

        //set first column format to plain text
        let sheet = ss.getSheetByName("Master");
        var column = sheet.getRange("L2:L");
        column.setNumberFormat("@");

        let master;
        let detail;
        if (ss != null) {
            let sort = [{ column: 10, ascending: false }, {
                column: 11
                , ascending: true
            }];
            response.master = Utils.getData2(ss, "Master", sort);
            response.detail = Utils.getData2(ss, "Detail");
        }
        else {
            response.domainResult = -1;
            response.addError("error", `File ${fileName} not found`, 404);
        }

        return response;
    }





    processForm(Data: KVPCollection, records: Array<RecordItemBase>, colSep = "\t", lineSep = "\n"): GSResponse {
        this.getLogLevel("Parameters");
        SysLog.log(0, "data received", "processForm()", JSON.stringify(Data));


        let response = new GSResponse();
        let data2 = new KVPCollection();
        data2.initialize("ROW,ID,INACTIVE,DAYS,MINUTES,Y,M,D,DOW");
        data2.addRange(Data);

        let recType = data2.get("REC_TYPE");
        let fpi = new FileProcessItem();
        let url = "";


        if (recType == "BROU") {
            response.fpi = this.importBatchBROU(recType, data2.get("EXTRACTO_BROU"));
            return response;
        }
        else if (recType == "REP") {
            response = this.report(Data);
            return response;
        }



        let id = this.getId("Id");
        let fecha = data2.get("FECHA");
        let dt = Utils.getDateFromYMD(fecha);
        let days = Utils.getDays(dt);
        let year = fecha.substring(0, 4);
        let hora = data2.get("HORA");
        let fileName = `${year}_data`;
        let lastRow = 2;
        let ss = Utils.getCreateSpreadSheet(this.folder, fileName, "Master,Detail", data2.getColNames());
        let sheet = ss.getActiveSheet();
        let range = sheet.getDataRange();
        var lastColumn = range.getLastColumn();
        let Y = 0;
        let M = 0;
        let D = 0;
        let DOW = 0;
        lastRow = range.getLastRow() + 1;


        data2.update("ID", id.toString());
        data2.update("ROW", lastRow.toString());
        data2.update("DAYS", days.toString());
        data2.update("MINUTES", Utils.getMinutes(hora).toString());
        Y = dt.getFullYear();
        M = dt.getMonth() + 1;
        D = dt.getDate();
        DOW = dt.getDay();
        data2.update("D", D.toString());
        data2.update("M", M.toString());
        data2.update("Y", Y.toString());
        data2.update("DOW", DOW.toString());




        let v = data2.getColValues().split(",");
        SysLog.log(0, "row verification v:", "service.ts oprocessForm() 675", JSON.stringify(v));
        SysLog.log(0, "data2", "service.ts oprocessForm() 675", JSON.stringify(data2));
        sheet.appendRow(v);

        if (records != null && records.length > 0) {
            sheet = ss.getSheetByName("Detail");
            range = sheet.getDataRange();
            lastRow = range.getLastRow();

            data2 = new KVPCollection();
            data2.initialize("ROW,IDMASTER,INACTIVE,ITEMID,CANT,DATA,DATA2");
            if (lastRow < 2) {
                let cols = data2.getColNames().split(",");
                sheet.appendRow(cols);
            }
            lastRow++;

            for (var i = 0; i < records.length; i++) {
                let row;

                if (recType == "EXE") {
                    let seconds = Utils.getSeconds2(records[i].time);
                    row = [lastRow, id, "", records[i].itemId, records[i].cant, seconds, records[i].time];
                }
                else
                    row = [lastRow, id, "", records[i].itemId, records[i].cant];

                sheet.appendRow(row);
                lastRow++;
            }
        }
        response.showModal = true;
        response.id = id;
        return response;
    }

    report(data: KVPCollection): GSResponse {
        let response = new GSResponse();
        let Data = new KVPCollection();
        let fileName = "BROUCesar";
        Data.arr = data.arr;

        SysLog.log(0, "data received", "service.ts report()", JSON.stringify(Data));

        this.dtDesde = new DateHelper();
        this.dtDesde = this.dtDesde.getFromYMDHMS(Data.get("FECHA_DESDE"));

        this.dtHasta = new DateHelper();
        this.dtHasta = this.dtHasta.getFromYMDHMS(Data.get("FECHA_HASTA"));

        SysLog.log(0, "FECHA DESDE", JSON.stringify(this.dtDesde));
        SysLog.log(0, "FECHA HASTA", JSON.stringify(this.dtHasta));

        let master;
        let detail;

        let ss = Utils.openSpreadSheet(fileName, this.folder);
        master = Utils.getData(ss, "Master").filter(x => x[3] >= this.dtDesde.days && x[3] <= this.dtHasta.days);
        response.detail = [[]];

        response.master = master;

        let filtrosHtml = HtmlService.createTemplateFromFile(`frontend/reportFilter`).evaluate().getContent();
        response.addHtml("filtros", filtrosHtml);
        SysLog.log(0, "response", "report", JSON.stringify(response));
        return response;

    }




}