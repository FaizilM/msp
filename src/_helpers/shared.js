/*
* TimeFilter aggregation across application
*/

export function getValueByTime(
    value,
    typeBy
) {
    let response = 0;
    if (value && typeBy) {
        if (value == 0) {
            value = 1;
        }
        switch (typeBy) {
            case "DAY":
                response = value * 24;
                break;
            case "WEEK":
                response = value * (24 * 7) - 24;
                break;
            case "MONTH":
                response = value * (24 * 30)- 24;
                break;
            case "YEAR":
                response = value * (24 * 366 )- 24;
                break;
            default:
                response = value;
        }
    }
    console.log("typeBy --> "+ typeBy +  ": "+  response);
    return response;
}