import moment from "moment";
import tr from "moment/locale/tr";
moment.updateLocale("tr", tr);

export function formatDate(date) {
    var now = moment();
    var start = moment(date);
    var diff = now.isSame(start, 'day');
    if (diff) {
        return start.startOf('hour').fromNow();
    } else if (start.year() == now.year()) {
        return start.format("D MMM LT");
    } else {
        return start.format("LLL");
    }
}

export default moment;