export class DateHelper
{
    dt = null;
    dateYMD = "";
    dateDMY = "";
    dateMDY = "";
    DOW = 0;
    hour = "";
    days = 0;
    minutes = 0;
    fullMinutes = 0;
    startDate = new Date(1900,0,1);
    D =0;
    M =1;
    Y =1900;
    H =0;
    Mi =0;
    S=0;



    getFromDateObject(dtObj:Date)
    {
        this.dt =dtObj;
        this.Y = this.dt.getFullYear();
        this.M = this.dt.getMonth()+1;
        this.D = this.dt.getDate();
        this.H = this.dt.getHours();
        this.Mi =this.dt.getMinutes();
        this.S = this.dt.getSeconds();

        this.dateYMD = `${this.Y}-${this.padLeft(this.M)}-${this.padLeft(this.D)}`;
        this.dateDMY = `${this.padLeft(this.D)}-${this.padLeft(this.M)}-${this.Y}`;
        this.hour = `${this.padLeft(this.H)}:${this.padLeft(this.Mi)}:${this.padLeft(this.S)}`;
        this.days = this.dt.getTime() - this.startDate.getTime();
        this.days = this.days / (1000 * 60 * 60 * 24);
        this.minutes = this.H*60 + this.Mi;
        this.DOW = this.dt.getDay();
        this.fullMinutes = this.days*24*60 + this.minutes;
        return this;
    }


    getFromYMDHMS(dateString, dateSep = "-", partsSeparator = " ", hourSeparator =":")
    {
        let y =1900;
        let p = dateString.split(partsSeparator);
        if ( p.length > 1)
        {
            let q = p[1].split(hourSeparator);
            if ( q.length > 2 )
                this.S = Number(q[2]);
            if ( q.length > 1 )
            {
                 this.H = Number(q[0]);
                 this.Mi = Number(q[1]);
            }
        }
        if ( p.length > 0 )
        {
            let q = p[0].split(dateSep);
            if ( q.length > 2 )
                this.D = Number(q[2]);
            if ( q.length > 1 )
                this.M = Number(q[1]);
            if ( q.length > 0 )
                this.Y = Number(q[0]);
        }
        this.dt = new Date(this.Y,this.M-1,this.D,this.D,this.Mi,this.S);
        this.dateYMD = `${this.Y}-${this.padLeft(this.M)}-${this.padLeft(this.D)}`;
        this.dateDMY = `${this.padLeft(this.D)}-${this.padLeft(this.M)}-${this.Y}`;
        this.hour = `${this.padLeft(this.H)}:${this.padLeft(this.Mi)}:${this.padLeft(this.S)}`;
        this.days = this.dt.getTime() - this.startDate.getTime();
        this.days = this.days / (1000 * 60 * 60 * 24);
        this.minutes = this.H*60 + this.Mi;
        this.DOW = this.dt.getDay();
        this.fullMinutes = this.days*24*60 + this.minutes;
        return this;
    }

    getFromDMYHMS(dateString, dateSep = "-", partsSeparator = " ", hourSeparator =":"){
        let y =1900;
        let p = dateString.split(partsSeparator);
        if ( p.length > 1)
        {
            let q = p[1].split(hourSeparator);
            if ( q.length > 2 )
                this.S = Number(q[2]);
            if ( q.length > 1 )
            {
                 this.H = Number(q[0]);
                 this.Mi = Number(q[1]);
            }
        }
        if ( p.length > 0 )
        {
            let q = p[0].split(dateSep);
            if ( q.length > 2 )
                this.Y = Number(q[2]);
            if ( q.length > 1 )
                this.M = Number(q[1]);
            if ( q.length > 0 )
                this.D = Number(q[0]);
        }
        this.dt = new Date(this.Y,this.M-1,this.D,this.D,this.Mi,this.S);
        this.dateYMD = `${this.Y}-${this.padLeft(this.M)}-${this.padLeft(this.D)}`;
        this.dateDMY = `${this.padLeft(this.D)}-${this.padLeft(this.M)}-${this.Y}`;
        this.hour = `${this.padLeft(this.H)}:${this.padLeft(this.Mi)}:${this.padLeft(this.S)}`;
        this.days = this.dt.getTime() - this.startDate.getTime();
        this.days = this.days / (1000 * 60 * 60 * 24);
        this.minutes = this.H*60 + this.Mi;
        this.DOW = this.dt.getDay();
        this.fullMinutes = this.days*24*60 + this.minutes;
        return this;
   }

    padLeft(value, maxValue = 10, padChars = "0") {
        if (value < maxValue)
            return `${padChars}${value.toString()}`;
        return value.toString();
    }
}