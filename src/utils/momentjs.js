import moment from "moment";
import tr from "moment/locale/tr";
moment.updateLocale("tr", tr);

export function formatDate(date) {
    var localTime  = moment.utc(date).toDate();
    //localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');

    var now = moment();
    var start = moment(localTime);
    var diff = now.isSame(start, 'day');

    if (diff) {
        return start.fromNow();
    } else if (start.year() == now.year()) {
        return start.format("D MMM LT");
    } else {
        return start.format("LLL");
    }
}

export default moment;