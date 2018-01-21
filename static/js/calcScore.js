var calcScore = function (index, answer) {
    console.log("index----" + index);
    console.log("answer----" + answer);
    switch (index + 1) {

        // 户籍所在县区
        case 2:
            var score = 0;
            $.ajax(
                {
                    url: "/quantization/check_city/",
                    async: false,
                    data: {"city": answer},
                    type: "post",
                    dataType: "json",
                    success: function (data) {
                        score = data;
                    },
                    error: function () {
                        layer.msg("城市查询出错");
                    }
                }
            );
            return score;
            break;
        //家庭住地
        case 3:
            if (answer === "近两年家庭实际住地在县城及以上") {
                return 0;
            } else if (answer === "近两年家庭实际住地在乡镇及以下") {
                return 1;
            } else {
                return 0;
            }
            break;
        //父亲职业
        case 4:
            if (answer === "公司股东或高管、私营业主、全职太太") {
                return 0;
            }
            else if (answer === "公司股东或高管、私营业主") {
                return 0;
            }
            else if (answer === "公务员、事业单位或国有企业工作人员、个体经营户") {
                return 1;
            } else if (answer === "进城务工人员或合同制工作人员") {
                return 2;
            } else if (answer === "务农或临时务工") {
                return 3;
            } else if (answer === "因身体或其他原因无法就业、失踪（联）或去世") {
                return 8;
            } else {
                return 0;
            }
            break;
        //    母亲职业
        case 5:
            if (answer === "公司股东或高管、私营业主、全职太太") {
                return 0;
            }
            else if (answer === "公司股东或高管、私营业主") {
                return 0;
            }
            else if (answer === "公务员、事业单位或国有企业工作人员、个体经营户") {
                return 1;
            } else if (answer === "进城务工人员或合同制工作人员") {
                return 2;
            } else if (answer === "务农或临时务工") {
                return 3;
            } else if (answer === "因身体或其他原因无法就业、失踪（联）或去世") {
                return 8;
            } else {
                return 0;
            }
            break;
        //    父亲劳动能力
        case 6:
            if (answer === "身体健康且有一技之长") {
                return 0;
            }
            else if (answer === "身体健康但无一技之长") {
                return 1;
            }
            else if (answer === "3-4级伤残，或有一定劳动能力") {
                return 3;
            } else if (answer === "1-2级伤残") {
                return 6;
            } else if (answer === "完全丧失劳动能力、失踪（联）或去世") {
                return 10;
            } else {
                return 0;
            }
            break;
        //    7.母亲劳动能力
        case 7:
            if (answer === "身体健康且有一技之长") {
                return 0;
            }
            else if (answer === "身体健康但无一技之长") {
                return 1;
            }
            else if (answer === "3-4级伤残，或有一定劳动能力") {
                return 3;
            } else if (answer === "1-2级伤残") {
                return 6;
            } else if (answer === "完全丧失劳动能力、失踪（联）或去世") {
                return 10;
            } else {
                return 0;
            }
            break;
        //    8.除父母亲之外其他家庭成员劳动能力
        case 8:
            if (answer === "无其他成员；或有其他成员且有劳动能力或固定收入") {
                return 0;
            }
            else if (answer === "其他家庭成员中部分有劳动能力或固定收入") {
                return 2;
            }
            else if (answer === "其他成员均无劳动能力或固定收入") {
                return 4;
            } else {
                return 0;
            }
            break;
        //9.房屋情况
        case 9:
            if (answer === "无房") {
                return 7;
            }
            else if (answer === "农村简易房或城市民房") {
                return 5;
            }
            else if (answer === "农村简易砖瓦房或城市廉租房、公租房") {
                return 3;
            } else if (answer === "其他房屋或两套及以上") {
                return 0;
            } else {
                return 0;
            }
            break;
        //10.就学人口
        case 10:
            if (answer === "1人") {
                return 0;
            }
            else if (answer === "2人") {
                return 1;
            }
            else if (answer === "3人及以上") {
                return 3;
            } else {
                return 0;
            }
            break;
        //    11.赡养人口
        case 11:
            if (answer === "0人") {
                return 0;
            }
            else if (answer === "1人") {
                return 1;
            }
            else if (answer === "2人及以上") {
                return 3;
            } else {
                return 0;
            }
            break;
        //    12.医疗支出
        case 12:
            if (answer === "家庭成员医疗费用个人负担部分在2000元及以内") {
                return 0;
            }
            else if (answer === "家庭成员医疗费用个人负担部分在2000-1万（含1万）") {
                return 2;
            }
            else if (answer === "家庭成员医疗费用个人负担部分在1万-3万（含3万）") {
                return 5;
            } else if (answer === "家庭成员医疗费用个人负担部分在3万以上或患重大疾病") {
                return 10;
            } else {
                return 0;
            }
            break;
        //    13.家庭受灾
        case 13:
            if (answer === "近两年内未遭受自然灾害") {
                return 0;
            }
            else if (answer === "近两年内遭受一般自然灾害，影响家庭收入") {
                return 2;
            }
            else if (answer === "近两年内遭受较重自然灾害，影响家庭收入且造成财产损失") {
                return 5;
            } else if (answer === "近两年内遭受严重自然灾害，造成人身伤害和财产重大损失") {
                return 10;
            } else {
                return 0;
            }
            break;
        //    14.家庭变故
        case 14:
            if (answer === "近两年内未出现家庭变故") {
                return 0;
            }
            else if (answer === "近两年内家庭成员出现伤残、失踪或意外事故造成财产损失等情况") {
                return 2;
            }
            else if (answer === "近两年内家庭成员出现重大伤残、意外死亡或重大变故") {
                return 5;
            } else {
                return 0;
            }
            break;
        //    15.在校期间获得国家或学校资助情况
        case 15:
            if (answer === "曾经获得过一项资助") {
                return 1;
            }
            else if (answer === "连续三年获得过资助") {
                return 3;
            }
            else if (answer === "连续五年获得过资助") {
                return 5;
            }
            else {
                return 0;
            }
            break;
        default:
            return 0;
            break;
    }
};