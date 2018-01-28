var calcDemocraticScore = function (index, answer) {
    switch (index + 1) {
        case 1:
            if (answer === "好（2分）") {
                return 2
            } else if (answer === "一般（1分）") {
                return 1;
            } else if (answer === "差（0分）") {
                return 0;
            }
            else {
                return 0;
            }
            break;

        case 2:
            if (answer === "好（2分）") {
                return 2
            } else if (answer === "一般（1分）") {
                return 1;
            } else if (answer === "差（0分）") {
                return 0;
            }
            else {
                return 0;
            }
            break;
        case 3:
            if (answer === "3000元以上（0分）") {
                return 0
            } else if (answer === "1000-3000元（1分）") {
                return 1;
            } else if (answer === "1000元以下（2分）") {
                return 2;
            }
            else {
                return 0;
            }
            break;
        case 4:
            if (answer === "有（0分）") {
                return 0;
            } else if (answer === "无（2分）") {
                return 2;
            }
            else {
                return 0;
            }
            break;
        case 5:
            if (answer === "高于一般水平（0分）") {
                return 0;
            } else if (answer === "等于一般水平（2分）") {
                return 2;
            } else if (answer === "低于一般水平（5分）") {
                return 5;
            }
            else {
                return 0;
            }
            break;
        case 6:
            if (answer === "有（0分）") {
                return 0
            } else if (answer === "无（2分）") {
                return 2;
            }
            else {
                return 0;
            }
            break;

    }
}