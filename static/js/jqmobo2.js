var curField = null;
var relationHT = new Array();
var relationQs = new Object();
var relationGroup = new Array();
var relationGroupHT = new Object();
var relationNotDisplayQ = new Object();

function setCookie(b, d, a, f, c, e) {
    document.cookie = b + "=" + escape(d) + ((a) ? "; expires=" + a : "") + ((f) ? "; path=" + f : "") + ((c) ? "; domain=" + c : "") + ((e) ? "; secure" : "");
}

var spChars = ["$", "}", "^", "|", "<"];
var spToChars = ["ξ", "｝", "ˆ", "¦", "&lt;"];
var prevInputControl = null;
var isLoadingAnswer = false;
var lastCostTime = 0;
var hasClickQ = false;
var needGoOut = false;
var hasShowTip = false;
var jpkeyword = "";
var enkeyword = "";
var enhighkeyword = "";
var enmiddlexiaokeyword = "";
var enmiddlekeyword = "";
var enxiaokeyword = "";
var enyouerkeyword = "";
var enforeinkeyword = "";
var enninekeyword = "";
var entenkeyword = "";
var en11keyword = "";
var en12keyword = "";
var jpmatch = 0;

function replace_specialChar(c) {
    for (var a = 0; a < spChars.length; a++) {
        var b = new RegExp("(\\" + spChars[a] + ")", "g");
        c = c.replace(b, spToChars[a]);
    }
    if (/^[A-Za-z\s\.,]+$/.test(c)) {
        c = c.replace(/\s+/g, " ");
    }
    c = c.replace(/[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]/ig, "");
    return $.trim(c);
}

function pushHistory() {
    if (document.referrer) {
        return;
    }
    var a = {title: "title", url: "#"};
    window.history.pushState(a, "title", "#");
    if (window.needHideShare == 1 || window.hideFriend == 1) {
        if (window.wx) {
            wx.hideMenuItems({menuList: menus});
        }
    }
}

function clickJp() {
    if (window._czc) {
        _czc.push(["_trackEvent", "未完成填写", "点击"]);
    }
    alert("提示：此活动仅限新用户领取，请按页面提示进行操作！");
    return true;
}

function show_zhezhao_tip(g) {
    if (g) {
        if ($("#zhezhaotip")[0]) {
            return;
        }
        var e = "";
        var b = window.notFinishTip.split(";");
        if (b.length == 2 && b[0].indexOf("http") == 0) {
            e = "<div style='width: 100%;height:80px; background-color: #e9f7ff; float: left;'><div style='float:left;margin-left:110px;font-size:14px; color: #6a696b; margin-top: 17px; line-height: 1.5;'>先领取<a onclick='return clickJp();' href='" + b[0] + "' style='text-decoration: underline; font-weight: bold;'>" + b[1] + "</a><br/>注满能量，再来填写吧！</div></div>";
        }
        var h = "<div style='width:100%; height:100px; background-color: #ffffff;float: left;'><div style='float: right; height: 100%; padding:15px;'><h1 style='font-size: 16px; color: #840615; line-height: 2.5;'>亲，你的意见很重要哦！</h1><div style='padding: 0 10px; background-color: #2c87f7; font-size: 16px; color: #fff; line-height: 2; float: left; border-radius: 6px;' onclick='show_zhezhao_tip(false);'>继续填写</div><div style='padding: 0 10px; background-color: #ababab; font-size: 16px; color: #fff; line-height: 2; float: left; border-radius: 6px; margin-left: 30px;' onclick='closeTipWindow(true);'>放弃</div></div></div>";
        var a = "<div class='popuptip' style='width:300px;background:#fff;border-radius: 4px;margin: auto;position: absolute; z-index: 9999;overflow: hidden;height:180px;'>" + h + e + "<img src='/images/wjx/smile.png' alt='' width='80' style='position: absolute; top:20px; left:10px;'>";
        "</div>";
        $("body").append('<div style="z-index:999;top: 0px;left: 0px;position: fixed;width: 100%;height: 100%;" id="zhezhaotip"><div style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;opacity: 0.5;background-color: #000;"></div>' + a + "</div>");
        var f = $("html").height();
        var c = $(window).height();
        var d = 100;
        c > f ? d = c : d = f;
        $("#zhezhaotip").height(d);
        $(".popuptip").css("left", ($(window).width() - $(".popuptip").width()) / 2);
        $(".popuptip").css("top", ($(window).height() - $(".popuptip").height()) / 2);
        if (!hasShowTip) {
            if (window._czc) {
                _czc.push(["_trackEvent", "未完成填写", "加载"]);
            }
        }
        setLastPop();
        hasShowTip = true;
    } else {
        $("#zhezhaotip").remove();
    }
}

function closeTipWindow(b) {
    var a = "确认不再填写问卷吗？";
    if (langVer == 1) {
        a = "Would you like to leave?";
    }
    if (window.WeixinJSBridge) {
        if (b || confirm(a)) {
            WeixinJSBridge.call("closeWindow");
        }
    } else {
        needGoOut = true;
        show_zhezhao_tip(false);
        if (window.close) {
            window.close();
        }
        window.history.back();
    }
}

function setLastPop() {
    if (!window.localStorage) {
        return;
    }
    localStorage.setItem("wjxlastpoptime", new Date().getTime());
}

function checkCanPop() {
    if (!window.localStorage) {
        return true;
    }
    if (localStorage.wjxuserpub) {
        return false;
    }
    if (window.location.href.indexOf("?pvw=1") > -1 || window.location.href.indexOf("&pvw=1") > -1) {
        return false;
    }
    if (window.isVip) {
        return false;
    }
    if (langVer == 1) {
        return false;
    }
    if (!window.notFinishTip) {
        return false;
    }
    var b = localStorage.wjxlastpoptime;
    if (!b) {
        return true;
    }
    var a = new Date().getTime();
    var c = (a - b) / (24 * 60 * 60 * 1000);
    if (c > 7) {
        return true;
    }
    return false;
}

$(function () {
    if (!$.support.leadingWhitespace) {
        window.location.href = window.location.href.replace("/m/", "/jq/");
    }
    if (!window.addEventListener) {
        return;
    }
    window.addEventListener("popstate", function (a) {
        if (!hasClickQ) {
            return;
        }
        if (needGoOut) {
            window.history.back();
            return;
        }
        pushHistory();
        var b = checkCanPop();
        if (window.notFinishTip && b) {
            show_zhezhao_tip(true);
        } else {
            closeTipWindow();
        }
    }, false);
});
String.prototype.format = function () {
    var a = arguments;
    return this.replace(/\{(\d+)\}/g, function (b, c) {
        return a[c];
    });
};
var curfilediv = null;
var isUploadingFile = false;
var cur_page = 0;
var hasSkipPage = false;
var prevControl = null;
var pageHolder = null;
var curMatrixFill = null;
var curMatrixError = null;
var imgVerify = null;
var questionsObject = new Object();
var allQArray = null;
var shopArray = new Array();

function setMatrixFill() {
    if (curMatrixError && !curMatrixFill.fillvalue) {
        return;
    }
    $("#divMatrixRel").hide();
}

function setChoice(b) {
    $(b.parentNode).find("span").html(b.options[b.selectedIndex].text);
    var a = $(b.parentNode).prev("input");
    a.val(b.value);
    a.trigger("change");
}

function showMatrixHeader(g, b) {
    if ($(b).attr("type") != "6") {
        return;
    }
    if ($(g).attr("mode") == "6") {
        return;
    }
    var e = $(g).offset();
    var l = e.top - $(g).height() + 7;
    var c = $(window).width();
    var j = $(g).parent().parent();
    var i = $("td", j).index($(g).parent());
    var a = $("table.matrix-rating", b)[0];
    var m = a.rows[0].cells[i];
    var f = $(m).text();
    var h = f.length * 12;
    var k = (h - $(g).width()) / 2;
    var d = e.left - k;
    $("#divMatrixHeader").css("top", l + "px").css("left", d + "px").html(f).show();
}

function showMatrixFill(f, c) {
    if (c) {
        if (curMatrixError) {
            return;
        }
        curMatrixError = f;
    }
    curMatrixFill = f;
    var e = f.fillvalue || "";
    $("#matrixinput").val(e);
    var b = $(f).attr("req");
    var a = "请注明...";
    var b = f.getAttribute("req");
    if (b) {
        a = "请注明...[必填]";
    }
    if (langVer == 1) {
        a = "Please specify";
    }
    matrixinput.setAttribute("placeholder", a);
    var g = $(f).offset();
    var d = g.top - $(f).height() - 15;
    $("#divMatrixRel").css("top", d + "px").css("left", "0").show();
}

function refresh_validate() {
    if (imgCode && tCode.style.display != "none" && imgCode.style.display != "none") {
        imgCode.src = "/AntiSpamImageGen.aspx?q=" + activityId + "&t=" + (new Date()).valueOf();
    }
    if (submit_text) {
        submit_text.value = "";
    }
    if (imgVerify) {
        imgVerify.onclick();
    }
    if (window.useAliVerify) {
        ncCaptchaObj.reset();
    }
}

function processRadioInput(a, b) {
    if (a.prevRadio && a.prevRadio.itemText && a.prevRadio != b) {
        a.prevRadio.itemText.pvalue = a.prevRadio.itemText.value;
        a.prevRadio.itemText.value = "";
    }
    if (b.itemText && b != a.prevRadio) {
        b.itemText.value = b.itemText.pvalue || "";
    }
    a.prevRadio = b;
}

function addClearHref(b) {
    if (window.isKaoShi) {
        return;
    }
    if (b.hasClearHref) {
        b.clearHref.style.display = "";
        return;
    }
    var a = document.createElement("a");
    a.title = validate_info_submit_title2;
    a.style.color = "#999999";
    a.style.marginLeft = "25px";
    a.innerHTML = "[" + type_radio_clear + "]";
    a.href = "javascript:void(0);";
    b.hasClearHref = true;
    $(".field-label", b).append(a);
    b.clearHref = a;
    a.onclick = function () {
        clearFieldValue(b);
        referTitle(b);
        this.style.display = "none";
        jumpAny(false, b);
        saveAnswer(b);
    };
}

function referTitle(e, f) {
    if (!e[0]._titleTopic) {
        return;
    }
    var b = "";
    if (f == undefined) {
        $("input:checked", e).each(function (h) {
            var g = $(this).parent().next().html();
            if (b) {
                b += "&nbsp;";
            }
            b += g;
        });
    } else {
        b = f;
    }
    for (var c = 0; c < e[0]._titleTopic.length; c++) {
        var a = e[0]._titleTopic[c];
        var d = document.getElementById("spanTitleTopic" + a);
        if (d) {
            d.innerHTML = b;
        }
    }
}

function showImg(b) {
    var a = $(b).attr("tpiao");
    if (!a) {
        return;
    }
    $("img", b).bind("click", function (f) {
        var d = this.parentNode.getAttribute("pimg");
        if (!d) {
            return;
        }
        var c = document.createElement("img");
        c.onload = function () {
            var g = document.getElementById("divImgPop");
            if (!g) {
                $("body").append("<div id='divImgPop' style='display:none;'></div>");
                g = document.getElementById("divImgPop");
            }
            var l = this.width;
            var j = this.height;
            var i = $(window).width();
            var k = $(window).height();
            var h, e;
            var m = 0.9;
            if (j > k * m) {
                e = k * m;
                h = e / j * l;
                if (h > i * m) {
                    h = i * m;
                }
            } else {
                if (l > i * m) {
                    h = i * m;
                    e = h / l * j;
                } else {
                    h = l;
                    e = j;
                }
            }
            g.innerHTML = "<img src='" + d + "' style='width:" + h + "px' alt=''/>";
            openDialogByIframe(h, e, "divImgPop");
        };
        c.src = d;
        f.preventDefault();
        f.stopPropagation();
        return false;
    });
}

var hasPeiEFull = false;

function checkPeiE(b, c) {
    if (hasPeiEFull) {
        return;
    }
    if (b.attr("req") != "1") {
        return;
    }
    if (b.attr("peie") == "1" && b.is(":visible")) {
        var a = true;
        $(c, b).each(function () {
            var d = this.disabled;
            if (!d) {
                a = false;
                return false;
            }
        });
        if (a) {
            hasPeiEFull = true;
        }
    }
    if (hasPeiEFull) {
        $(divTip).html("此问卷配额已满，暂时不能填写！").show();
    }
}

$(function () {
    pageHolder = $("fieldset.fieldset");
    for (var z = 0; z < pageHolder.length; z++) {
        var F = $(pageHolder[z]).attr("skip") == "true";
        if (F) {
            pageHolder[z].skipPage = true;
            hasSkipPage = true;
        }
        var a = $(".field", pageHolder[z]);
        pageHolder[z].questions = a;
        var v = 0;
        for (var A = 0; A < a.length; A++) {
            a[A].indexInPage = v;
            a[A].pageIndex = z;
            if (hasSkipPage) {
                a[A].pageParent = pageHolder[z];
            }
            v++;
        }
    }
    $("#divMatrixRel").bind("click", function (i) {
        i.stopPropagation();
    });
    $(document).bind("click", function () {
        setMatrixFill();
        postHeight();
    });
    $("#matrixinput").on("keyup blur focus", function () {
        if (curMatrixFill) {
            var q = $("#matrixinput").val();
            curMatrixFill.fillvalue = q;
            if (window.needSaveJoin) {
                var i = $(curMatrixFill).parents(".field");
                var k = i.attr("ischeck");
                saveMatrixFill(curMatrixFill, k);
                saveAnswer(i);
            }
        }
    });
    jpkeyword = (window.jpkeylist || "").split(/[,，]/);
    enkeyword = (window.enkeylist || "").split(/[,，]/);
    enhighkeyword = (window.enhighkeylist || "").split(/[,，]/);
    enmiddlekeyword = (window.enmiddlekeylist || "").split(/[,，]/);
    enmiddlexiaokeyword = (window.enmiddlexiaokeylist || "").split(/[,，]/);
    enxiaokeyword = (window.enxiaokeylist || "").split(/[,，]/);
    enyouerkeyword = (window.enyouerkeylist || "").split(/[,，]/);
    enforeinkeyword = (window.enforeinkeylist || "").split(/[,，]/);
    if (window.enninekeylist) {
        enninekeyword = (window.enninekeylist || "").split(/[,，]/);
    }
    if (window.entenkeylist) {
        entenkeyword = (window.entenkeylist || "").split(/[,，]/);
    }
    if (window.en11keylist) {
        en11keyword = (window.en11keylist || "").split(/[,，]/);
    }
    if (window.en12keylist) {
        en12keyword = (window.en12keylist || "").split(/[,，]/);
    }
    checkTitleDescMatch();
    var b = false;
    var E = new Array();
    allQArray = $(".field");
    allQArray.each(function () {
        var S = $(this);
        var q = S.attr("type");
        S.bind("click", function () {
            if (this.removeError) {
                this.removeError();
            }
            if (!hasClickQ) {
                pushHistory();
            }
            hasClickQ = true;
            try {
                checkJpMatch(q, this);
            } catch (k) {
            }
            if (window.loadGeetest) {
                window.loadGeetest();
            }
            if (window.scrollup) {
                scrollup.Stop();
            }
        });
        var Z = getTopic(S);
        questionsObject[Z] = S;
        var ac = S.attr("isshop");
        if (ac) {
            shopArray.push(this);
        }
        var O = S.attr("relation");
        if (O && O != "0") {
            if (O.indexOf("|") != -1) {
                var M = O.split("|");
                for (var aa in M) {
                    var K = M[aa];
                    if (!K || K.indexOf(",") == -1) {
                        continue;
                    }
                    var J = K.split(",");
                    var af = J[0];
                    var V = J[1].split(";");
                    for (var Q = 0; Q < V.length; Q++) {
                        var L = af + "," + V[Q];
                        if (!relationGroupHT[L]) {
                            relationGroupHT[L] = new Array();
                        }
                        relationGroupHT[L].push(this);
                    }
                    if (!relationQs[af]) {
                        relationQs[af] = new Array();
                    }
                    relationQs[af].push(this);
                    relationGroup.push(af);
                }
            } else {
                var J = O.split(",");
                var af = J[0];
                var V = J[1].split(";");
                for (var Q = 0; Q < V.length; Q++) {
                    var L = af + "," + V[Q];
                    if (!relationHT[L]) {
                        relationHT[L] = new Array();
                    }
                    relationHT[L].push(this);
                }
                if (!relationQs[af]) {
                    relationQs[af] = new Array();
                }
                relationQs[af].push(this);
            }
            relationNotDisplayQ[Z] = "1";
        } else {
            if (O == "0") {
                relationNotDisplayQ[Z] = "1";
            }
        }
        var T = S.attr("titletopic");
        if (T) {
            var ad = questionsObject[T];
            if (ad) {
                if (!ad[0]._titleTopic) {
                    ad[0]._titleTopic = new Array();
                }
                ad[0]._titleTopic.push(Z);
                var R = S.find(".field-label")[0];
                if (R) {
                    R.innerHTML = R.innerHTML.replace("[q" + T + "]", "<span id='spanTitleTopic" + Z + "' style='text-decoration:underline;'></span>");
                }
            }
        }
        if (S.attr("hrq") == "1") {
            return true;
        }
        if (q == "1") {
            var W = $("input", S);
            if (W[1]) {
                W[0].confirmPwd = W[1];
                W[1].firstPwd = W[0];
                $(W[1]).on("keyup", function () {
                    this.firstPwd.needCheckConfirm = true;
                    verifyTxt(S, $(this));
                });
                W = $(W[0]);
            }
            W.on("keyup blur click", function () {
                verifyTxt(S, W);
                prevInputControl = this;
                window.hasAnswer = true;
                jump(S, this);
                referTitle(S, this.value);
                saveAnswer(S);
            });
            if (window.needSaveJoin) {
                W.change(function () {
                    saveAnswer(S);
                });
            }
            W.blur(function () {
                checkOnly(S, W);
            });
            var U = $("textarea", S);
            if (U[0]) {
                var i = U.prev("a")[0];
                i.par = S[0];
                U[0].par = S[0];
                S[0].needsms = true;
                var ae = U.parent().find(".phonemsg")[0];
                S[0].mobileinput = W[0];
                S[0].verifycodeinput = U[0];
                i.onclick = function () {
                    if (this.disabled) {
                        return;
                    }
                    var ah = this.par;
                    if (!/^\d{11}$/.test(ah.mobileinput.value)) {
                        alert("请输入正确的手机号码");
                        return;
                    }
                    if (ah.issmsvalid && ah.mobile == ah.mobileinput.value) {
                        return;
                    }
                    if (this.isSending) {
                        return;
                    }
                    if (!U[1]) {
                        return;
                    }
                    if (this.repeat && !confirm("您输入的手机号码“" + ah.mobileinput.value + "”确认准确无误吗？")) {
                        return;
                    }
                    if (this.getAttribute("nocode") == "1") {
                        i.sendActivitySms("0000");
                        return;
                    }
                    var ai = "divVCode" + Z;
                    openDialogByIframe(300, 70, ai);
                    var k = document.getElementById("yz_popdivData");
                    var aj = k.getElementsByTagName("textarea")[0];
                    var ag = k.getElementsByTagName("img")[0];
                    if (ag.style.display == "none") {
                        ag.onclick = function () {
                            this.src = "/AntiSpamImageGen.aspx?t=" + (new Date()).valueOf();
                        };
                        ag.style.display = "";
                        ag.onclick();
                    }
                    $(aj).on("keyup blur", function () {
                        var ak = /^[0-9a-zA-Z]{4}$/g;
                        if (ak.test(this.value)) {
                            i.sendActivitySms(this.value);
                            this.value = "";
                            $("#yz_popTanChuClose").click();
                        }
                    });
                    aj.focus();
                };
                i.sendActivitySms = function (ai) {
                    this.isSending = true;
                    this.disabled = true;
                    var ah = this.par;
                    var ag = this;
                    var k = "/Handler/AnswerSmsHandler.ashx?q=" + activityId + "&mob=" + escape(ah.mobileinput.value) + "&valcode=" + ai + "&t=" + (new Date()).valueOf();
                    $.ajax({
                        type: "GET", url: k, async: false, success: function (aj) {
                            var ak = "";
                            if (aj == "true") {
                                ak = "成功发送，每天最多发送5次。如未收到，请检查手机号是否正确！";
                                ag.repeat = 1;
                                ag.resent();
                            } else {
                                if (aj == "fast") {
                                    ak = "发送频率过快";
                                    ag.resent();
                                } else {
                                    if (aj == "no") {
                                        ak = "发布者短信数量不够";
                                    } else {
                                        if (aj == "fail") {
                                            ak = "短信发送失败，每天最多发送5次！";
                                        } else {
                                            if (aj == "error") {
                                                ak = "手机号码不正确";
                                            } else {
                                                if (aj == "nopub") {
                                                    ak = "问卷未运行，不能填写";
                                                } else {
                                                    ak = aj;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (ak.indexOf("图形验证码") > -1) {
                                ag.disabled = false;
                            }
                            ae.innerHTML = ak;
                            ag.isSending = false;
                        }
                    });
                };
                i.resent = function () {
                    var ag = this;
                    var k = 60;
                    var ah = setInterval(function () {
                        k--;
                        if (k < 57) {
                            ag.isSending = false;
                        }
                        if (k > 0) {
                            ag.innerHTML = "重发(" + k + "秒)";
                        } else {
                            ag.innerHTML = "发送验证码";
                            ag.disabled = false;
                            clearInterval(ah);
                        }
                    }, 1000);
                };
                U[0].onchange = U[0].onblur = function () {
                    var ah = $.trim(this.value);
                    if (ah.length != 6) {
                        ae.innerHTML = "提示：请输入6位数字！";
                        return;
                    }
                    if (!/^\d+$/.exec(ah)) {
                        ae.innerHTML = "提示：请输入6位数字！";
                        return;
                    }
                    var ag = this.par;
                    if (ag.issmsvalid && ag.mobile == ag.mobileinput.value) {
                        return;
                    }
                    if (ag.prevcode == ah) {
                        return;
                    }
                    ag.prevcode = ah;
                    var k = "/Handler/AnswerSmsValidateHandler.ashx?q=" + activityId + "&mob=" + escape(ag.mobileinput.value) + "&code=" + escape(ah) + "&t=" + (new Date()).valueOf();
                    $.ajax({
                        type: "GET", url: k, async: false, success: function (ai) {
                            ag.issmsvalid = false;
                            var aj = "";
                            if (ai == "true") {
                                ag.issmsvalid = true;
                                ag.mobile = ag.mobileinput.value;
                                aj = "成功通过验证";
                                writeError(ag, "", 1000);
                            } else {
                                if (ai == "send") {
                                    aj = "请先发送验证码，每天最多发送5次！";
                                } else {
                                    if (ai == "no") {
                                        aj = "验证码输入错误超过5次，无法再提交";
                                    } else {
                                        if (ai == "error") {
                                            aj = "验证码输入错误，连续输错5次将无法提交";
                                        }
                                    }
                                }
                            }
                            ae.innerHTML = aj;
                        }
                    });
                };
            }
        } else {
            if (q == "2") {
                var W = $("textarea", S);
                W.on("keyup blur click", function () {
                    verifyTxt(S, W);
                    prevInputControl = this;
                    window.hasAnswer = true;
                    jump(S, this);
                    referTitle(S, this.value);
                    saveAnswer(S);
                });
                W.blur(function () {
                    checkOnly(S, W);
                });
            } else {
                if (q == "9") {
                    var X = $("input", S);
                    X.on("keyup blur change", function () {
                        var k = $(this);
                        prevInputControl = this;
                        msg = verifyTxt(S, $(this), true);
                        jump(S, this);
                        saveAnswer(S);
                    });
                    X.blur(function () {
                        checkOnly(S, $(this));
                    });
                } else {
                    if (q == "8") {
                        $("input", S).change(function () {
                            jump(S, this);
                            saveAnswer(S);
                        });
                    } else {
                        if (q == "12") {
                            $("input", S).change(function () {
                                var ag = null;
                                var aj = $(S).attr("total");
                                var ak = $("input:visible", S);
                                var ah = count = ak.length;
                                var al = aj;
                                ak.each(function (am) {
                                    if (am == ah - 1) {
                                        ag = this;
                                    }
                                    if ($(this).val()) {
                                        count--;
                                        al = al - $(this).val();
                                    }
                                });
                                if (count == 1 && ag && al > 0) {
                                    $(ag).val(al).change();
                                    al = 0;
                                }
                                msg = "";
                                if (al != 0 && count == 0) {
                                    var ai = parseInt($(ag).val()) + al;
                                    if (ai >= 0) {
                                        if (ag != this) {
                                            $(ag).val(ai).change();
                                            al = 0;
                                        } else {
                                            if (ak.length == 2) {
                                                var k = aj - $(ag).val();
                                                $(ak[0]).val(k).change();
                                                al = 0;
                                            }
                                        }
                                    } else {
                                        msg = "，<span style='color:red;'>" + sum_warn + "</span>";
                                    }
                                }
                                if (al == 0) {
                                    ak.each(function (am) {
                                        if (!$(this).val()) {
                                            $(this).val("0").change();
                                        }
                                    });
                                }
                                $(".relsum", S).html(sum_total + "<b>" + aj + "</b>" + sum_left + "<span style='color:red;font-bold:true;'>" + (aj - al) + "</span>" + msg);
                                jump(S, this);
                                saveAnswer(S);
                            });
                        } else {
                            if (q == "13") {
                                b = true;
                            } else {
                                if (q == "3") {
                                    var P = $("div.ui-radio", S);
                                    P.each(function () {
                                        if (window.hasTouPiao) {
                                            var k = this.getAttribute("htp");
                                            if (k) {
                                                var ag = document.getElementById("spanPiao" + Z + "_" + k);
                                                if (ag) {
                                                    ag.style.display = "";
                                                }
                                            }
                                        }
                                        showImg(this);
                                    });
                                    checkPeiE(S, "input[type='radio']");
                                    P.bind("click", function (ai) {
                                        var ag = $(this);
                                        if (S[0] && S[0].hasConfirm) {
                                            return;
                                        }
                                        var ah = ag.find("input[type='radio']")[0];
                                        if (ah.disabled) {
                                            return;
                                        }
                                        window.hasAnswer = true;
                                        $(S).find("div.ui-radio").each(function () {
                                            var aj = $(this);
                                            aj.find("input[type='radio']")[0].checked = false;
                                            aj.find("a.jqradio").removeClass("jqchecked");
                                        });
                                        ah.checked = true;
                                        var k = ag.find("input.OtherRadioText")[0];
                                        if (k) {
                                            ah.itemText = k;
                                        }
                                        processRadioInput(S[0], ah);
                                        ag.find("a.jqradio").addClass("jqchecked");
                                        displayRelationByType(S, "input[type=radio]", 1);
                                        referTitle(S);
                                        jump(S, ah);
                                        if (S.attr("req") != "1") {
                                            addClearHref(S);
                                        }
                                        showAnswer(S, P, true);
                                        saveAnswer(S);
                                        if (ag.attr("desc") != 1) {
                                            ai.preventDefault();
                                        }
                                    });
                                    var ab = S.attr("qingjing");
                                    if (ab) {
                                        E.push(S);
                                    }
                                    $("input.OtherRadioText", S).bind("click", function (aj) {
                                        $(this.parentNode.parentNode.parentNode).find("div.ui-radio").each(function () {
                                            $(this).find("input[type='radio']")[0].checked = false;
                                            $(this).find("a.jqradio").removeClass("jqchecked");
                                        });
                                        prevInputControl = this;
                                        var k = $(this).attr("rel");
                                        var ah = $("#" + k)[0];
                                        ah.checked = true;
                                        var ag = $("#" + k).parent().parent();
                                        ag.find("a.jqradio").addClass("jqchecked");
                                        ah.itemText = this;
                                        var ai = $(this).parents("div.field");
                                        processRadioInput(ai[0], ah);
                                        displayRelationByType(ai, "input[type=radio]", 1);
                                        jump(ai, ah);
                                        saveAnswer(ai);
                                        aj.stopPropagation();
                                        aj.preventDefault();
                                    });
                                    if (window.needSaveJoin) {
                                        $("input.OtherRadioText", S).bind("blur", function (k) {
                                            saveAnswer(S);
                                        });
                                    }
                                } else {
                                    if (q == "7") {
                                        var N = $("select", S);
                                        N.bind("change", function (ag) {
                                            $("span", this.parentNode).html(this.options[this.selectedIndex].text);
                                            displayRelationByType(S, "option", 5);
                                            jump(S, this.options[this.selectedIndex]);
                                            var k = this.options[this.selectedIndex].text;
                                            if (this.value == -2) {
                                                k = "";
                                            }
                                            referTitle(S, k);
                                            saveAnswer(S);
                                            ag.preventDefault();
                                        });
                                        if (N[0].selectedIndex > 0) {
                                            $("span", N[0].parentNode).html(N[0].options[N[0].selectedIndex].text);
                                        }
                                    } else {
                                        if (q == "10") {
                                            var Y = S.attr("select") == "1";
                                            if (Y) {
                                                $("select", S).bind("change", function () {
                                                    $("span", this.parentNode).html(this.options[this.selectedIndex].text);
                                                    jump(S, this);
                                                    saveAnswer(S);
                                                });
                                            }
                                            $("input", S).bind("change blur", function () {
                                                var ak = $(this);
                                                var aj = ak.val();
                                                prevInputControl = this;
                                                var ag = ak.attr("isdigit");
                                                var ai = ag == "1" || ag == "2";
                                                if (ai) {
                                                    if (ag == "1" && parseInt(aj) != aj) {
                                                        ak.val("");
                                                    } else {
                                                        if (ag == "2" && parseFloat(aj) != aj) {
                                                            ak.val("");
                                                        } else {
                                                            var ah = ak.attr("min");
                                                            if (ah && aj - ah < 0) {
                                                                ak.val("");
                                                            }
                                                            var k = ak.attr("max");
                                                            if (k && aj - k > 0) {
                                                                ak.val("");
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    msg = verifyTxt(S, $(this), true);
                                                }
                                                jump(S, this);
                                                saveAnswer(S);
                                            });
                                        } else {
                                            if (q == "5") {
                                                initRate(S);
                                            } else {
                                                if (q == "6") {
                                                    initRate(S, true);
                                                } else {
                                                    if (q == "4") {
                                                        var I = $("div.ui-checkbox", S);
                                                        I.each(function () {
                                                            if (window.hasTouPiao) {
                                                                var k = this.getAttribute("htp");
                                                                if (k) {
                                                                    var ag = document.getElementById("spanPiao" + Z + "_" + k);
                                                                    if (ag) {
                                                                        ag.style.display = "";
                                                                    }
                                                                }
                                                            }
                                                            showImg(this);
                                                        });
                                                        checkPeiE(S, "input[type='checkbox']");
                                                        I.bind("click", function (ah) {
                                                            var ai = $(this);
                                                            if (S[0] && S[0].hasConfirm) {
                                                                return;
                                                            }
                                                            var ag = ai.find("input[type='checkbox']")[0];
                                                            if (ag.disabled) {
                                                                return;
                                                            }
                                                            ag.checked = !ag.checked;
                                                            window.hasAnswer = true;
                                                            if (ag.checked) {
                                                                ai.find("a.jqcheck").addClass("jqchecked");
                                                            } else {
                                                                ai.find("a.jqcheck").removeClass("jqchecked");
                                                            }
                                                            checkHuChi(S, this);
                                                            displayRelationByType(S, "input[type='checkbox']", 2);
                                                            verifyCheckMinMax(S, false, false, this);
                                                            jump(S, ag);
                                                            if (window.createItem) {
                                                                createItem(S);
                                                            }
                                                            var k = ai.find("input.OtherText")[0];
                                                            if (k) {
                                                                if (!ag.checked) {
                                                                    k.pvalue = k.value;
                                                                    k.value = "";
                                                                } else {
                                                                    k.value = k.pvalue || "";
                                                                }
                                                            }
                                                            referTitle(S);
                                                            showAnswer(S, I);
                                                            saveAnswer(S);
                                                            ah.preventDefault();
                                                        });
                                                        $("input.OtherText", S).bind("click", function (ak) {
                                                            var ag = $(this).attr("rel");
                                                            var ah = $("#" + ag)[0];
                                                            prevInputControl = this;
                                                            var aj = $(this).parents("div.field");
                                                            var k = aj.attr("maxvalue");
                                                            if (k) {
                                                                var al = $("input:checked", aj).length;
                                                                if (al > k || (al == k && !ah.checked)) {
                                                                    $(this).blur();
                                                                    ak.stopPropagation();
                                                                    ak.preventDefault();
                                                                    return;
                                                                }
                                                            }
                                                            ah.checked = true;
                                                            ah.itemText = this;
                                                            var ai = $("#" + ag).parents(".ui-checkbox");
                                                            ai.find("a.jqcheck").addClass("jqchecked");
                                                            if (this.pvalue && !this.value) {
                                                                this.value = this.pvalue;
                                                            }
                                                            checkHuChi(aj, ai[0]);
                                                            displayRelationByType(aj, "input[type=checkbox]", 2);
                                                            jump(aj, ah);
                                                            verifyCheckMinMax(aj, false);
                                                            if (window.createItem) {
                                                                createItem(aj);
                                                            }
                                                            saveAnswer(aj);
                                                            ak.stopPropagation();
                                                            ak.preventDefault();
                                                        });
                                                        if (window.needSaveJoin) {
                                                            $("input.OtherText", S).bind("blur", function (k) {
                                                                saveAnswer(S);
                                                            });
                                                        }
                                                    } else {
                                                        if (q == "21") {
                                                            $(".shop-item", S).each(function () {
                                                                var k = $(".itemnum", this);
                                                                var ag = $(".item_left", this);
                                                                $(".add", this).bind("click", function (ai) {
                                                                    var al = false;
                                                                    var ah = 0;
                                                                    if (ag[0]) {
                                                                        al = true;
                                                                        ah = parseInt(ag.attr("num"));
                                                                    }
                                                                    var ak = parseInt(k.val());
                                                                    if (al && ak >= ah) {
                                                                        var aj = "库存只剩" + ah + "件，不能再增加！";
                                                                        if (ah <= 0) {
                                                                            aj = "已售完，无法添加";
                                                                        }
                                                                        alert(aj);
                                                                    } else {
                                                                        k.val(ak + 1);
                                                                        updateCart(S);
                                                                    }
                                                                    ai.preventDefault();
                                                                });
                                                                k.bind("focus", function (ah) {
                                                                    if (k.val() == "0") {
                                                                        k.val("");
                                                                    }
                                                                });
                                                                k.bind("blur change", function (aj) {
                                                                    if (!k.val()) {
                                                                        k.val("0");
                                                                    }
                                                                    var am = parseInt(k.val());
                                                                    if (!am || am < 0) {
                                                                        k.val("0");
                                                                        updateCart(S);
                                                                        return;
                                                                    }
                                                                    var al = false;
                                                                    var ai = 0;
                                                                    if (ag[0]) {
                                                                        al = true;
                                                                        ai = parseInt(ag.attr("num"));
                                                                    }
                                                                    if (al) {
                                                                        if (am > ai) {
                                                                            var ak = "库存只剩" + ai + "件，不能超过库存！";
                                                                            if (ai <= 0) {
                                                                                ak = "已售完，无法添加";
                                                                            }
                                                                            alert(ak);
                                                                            var ah = ai;
                                                                            if (ah < 0) {
                                                                                ah = 0;
                                                                            }
                                                                            k.val(ah);
                                                                        }
                                                                    }
                                                                    updateCart(S);
                                                                    aj.preventDefault();
                                                                });
                                                                $(".remove", this).bind("click", function (ah) {
                                                                    var ai = parseInt(k.val());
                                                                    if (ai > 0) {
                                                                        k.val(ai - 1);
                                                                        updateCart(S);
                                                                    }
                                                                    ah.preventDefault();
                                                                });
                                                            });
                                                        } else {
                                                            if (q == "11") {
                                                                $("li.ui-li-static", S).bind("click", function (ah) {
                                                                    var k = $(this).find("input.OtherText")[0];
                                                                    if (!$(this).attr("check")) {
                                                                        var ag = $(this.parentNode).find("li[check='1']").length + 1;
                                                                        $(this).find("span.sortnum").html(ag).addClass("sortnum-sel");
                                                                        $(this).attr("check", "1");
                                                                        if (k) {
                                                                            k.value = k.pvalue || "";
                                                                        }
                                                                    } else {
                                                                        var ag = $(this).find("span").html();
                                                                        $(this.parentNode).find("li[check='1']").each(function () {
                                                                            var ai = $(this).find("span.sortnum").html();
                                                                            if (ai - ag > 0) {
                                                                                $(this).find("span.sortnum").html(ai - 1);
                                                                            }
                                                                        });
                                                                        $(this).find("span.sortnum").html("").removeClass("sortnum-sel");
                                                                        $(this).attr("check", "");
                                                                        if (k) {
                                                                            k.pvalue = k.value;
                                                                            k.value = "";
                                                                        }
                                                                    }
                                                                    displayRelationByType(S, "li.ui-li-static", 3);
                                                                    verifyCheckMinMax(S, false, true, this);
                                                                    jump(S, this);
                                                                    if (window.createItem) {
                                                                        createItem(S, true);
                                                                    }
                                                                    saveAnswer(S);
                                                                    ah.preventDefault();
                                                                });
                                                                $("input.OtherText", S).bind("click", function (aj) {
                                                                    aj.stopPropagation();
                                                                    aj.preventDefault();
                                                                    var k = $(this).attr("rel");
                                                                    var ah = $("#" + k).eq(0).parent("li.ui-li-static");
                                                                    var ag = ah.eq(0).parent("ul.ui-controlgroup");
                                                                    if (ah.attr("check") != 1) {
                                                                        var ai = ag.find("li[check='1']").length + 1;
                                                                        ah.find("span.sortnum").html(ai).addClass("sortnum-sel");
                                                                        ah.attr("check", "1");
                                                                    }
                                                                    displayRelationByType(S, "li.ui-li-static", 3);
                                                                    verifyCheckMinMax(S, false, true, this);
                                                                    jump(S, this);
                                                                    if (window.createItem) {
                                                                        createItem(S, true);
                                                                    }
                                                                    saveAnswer(S);
                                                                    aj.preventDefault();
                                                                });
                                                                if (window.needSaveJoin) {
                                                                    $("input.OtherText", S).bind("blur", function (k) {
                                                                        saveAnswer(S);
                                                                    });
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    if (window.totalCut && window.totalCut > 0) {
        for (var A = 0; A < window.totalCut; A++) {
            var l = "divCut" + (A + 1);
            var G = $("#" + l);
            var m = G.attr("relation");
            if (m && m != "0") {
                if (m.indexOf("|") != -1) {
                    var h = m.split("|");
                    for (var z in h) {
                        var f = h[z];
                        if (!f || f.indexOf(",") == -1) {
                            continue;
                        }
                        var e = f.split(",");
                        var H = e[0];
                        var t = e[1].split(";");
                        for (var o = 0; o < t.length; o++) {
                            var g = H + "," + t[o];
                            if (!relationGroupHT[g]) {
                                relationGroupHT[g] = new Array();
                            }
                            relationGroupHT[g].push(G[0]);
                        }
                        if (!relationQs[H]) {
                            relationQs[H] = new Array();
                        }
                        relationQs[H].push(G[0]);
                        relationGroup.push(H);
                    }
                } else {
                    var e = m.split(",");
                    var H = e[0];
                    var t = e[1].split(";");
                    relationNotDisplayQ[G.attr("topic")] = "1";
                    for (var o = 0; o < t.length; o++) {
                        var g = H + "," + t[o];
                        if (!relationHT[g]) {
                            relationHT[g] = new Array();
                        }
                        relationHT[g].push(G[0]);
                    }
                    if (!relationQs[H]) {
                        relationQs[H] = new Array();
                    }
                    relationQs[H].push(G[0]);
                }
            }
            var s = G.attr("titletopic");
            if (s) {
                var C = questionsObject[s];
                if (C) {
                    if (!C[0]._titleTopic) {
                        C[0]._titleTopic = new Array();
                    }
                    var y = G.attr("topic");
                    C[0]._titleTopic.push(y);
                    var p = G[0].childNodes[0];
                    if (p) {
                        p.innerHTML = p.innerHTML.replace("[q" + s + "]", "<span id='spanTitleTopic" + y + "' style='text-decoration:underline;'></span>");
                    }
                }
            }
        }
    }
    for (var x = 0; x < pageHolder.length; x++) {
        var a = pageHolder[x].questions;
        for (var A = 0; A < a.length; A++) {
            var y = getTopic(a[A]);
            if (relationQs[y]) {
                relationJoin(a[A]);
            }
            var B = $(a[A]).attr("refered");
            if (B && window.createItem) {
                createItem(a[A]);
            }
        }
    }
    for (var j = 0; j < E.length; j++) {
        var r = E[j];
        if (r[0].style.display == "") {
            displayRelationByType(r, "input[type=radio]", 1);
        }
    }
    $("#ctlNext") != null && $("#ctlNext").on("click", function () {
        debugLog("准备提交答卷");
        if (this.disabled) {
            return;
        }
        if (needTip()) {
            alert($(divTip).text());
            return;
        }
        $("#action").val("1");
        debugLog("验证提交数据");
        var i = validate();
        if (!i) {
            return;
        }
        debugLog("判断是否需要验证码");
        if (window.useAliVerify) {
            if (!isCaptchaValid) {
                $(".ValError").html("请先通过滑动验证！");
                return;
            }
        } else {
            if (tCode && tCode.style.display != "none" && (submit_text.value == "" || submit_text.value == validate_info_submit_title3)) {
                try {
                    submit_text.focus();
                    submit_text.click();
                } catch (k) {
                }
                alert(validate_info_submit1);
                return;
            }
        }
        debugLog("进入提交函数");
        groupAnswer(1);
    });
    setVerifyCode();
    initSlider();
    if (totalPage > 1) {
        $("#divSubmit").hide();
        $("#divNext")[0].style.display = "";
        showProgress();
    } else {
        $("#divSubmit").show();
    }
    if (window.hasPageTime) {
        if (!window.divFengMian) {
            processMinMax();
        }
    }
    fixBottom();
    $(window).load(function () {
        fixBottom();
    });
    if (window.cepingCandidate) {
        var u = cepingCandidate.split(",");
        var w = new Object();
        for (var D = 0; D < u.length; D++) {
            var d = u[D].replace(/(\s*)/g, "").replace(/&/g, "").replace(/\\/g, "").replace("&nbsp;", "");
            w[d] = "1";
        }
        var n = $("#div1");
        $("input[type=checkbox]", n).each(function () {
            var q = $(this).parent().parent();
            var k = q.find(".label")[0];
            if (!k) {
                return true;
            }
            var i = k.innerHTML;
            i = i.replace(/(\s*)/g, "").replace(/&amp;/g, "").replace(/\\/g, "").replace("&nbsp;", "");
            if (w[i]) {
                this.checked = true;
            }
        });
        if (n[0]) {
            createItem(n, false);
            n[0].style.display = "none";
            n[0].isCepingQ = "1";
        }
    }
    processAward();
    checkAnswer();
    var c = document.getElementsByTagName("img");
    for (var A = 0; A < c.length; A++) {
        c[A].onerror = function () {
            this.onerror = null;
            replaceImg(this);
        };
        replaceImg(c[A]);
    }
    processSearch();
});

function replaceImg(c) {
    var b = "http://pubimage.sojump.cn";
    var a = "http://pubalifr.sojump.cn";
    if (c.src.indexOf("http://pubssl.sojump.com") == 0 || c.src.indexOf("https://pubssl.sojump.com") == 0 || c.src.indexOf("http://pubimage.sojump.com") == 0) {
        c.src = c.src.replace("http://pubssl.sojump.com", b).replace("https://pubssl.sojump.com", b).replace("http://pubimage.sojump.com", b);
    } else {
        if (c.src.indexOf("http://pubalifr.sojump.com") == 0 || c.src.indexOf("https://pubalifr.sojump.com") == 0 || c.src.indexOf("https://pubali.sojump.com") == 0 || c.src.indexOf("http://pubali.sojump.com") == 0) {
            c.src = c.src.replace("http://pubalifr.sojump.com", a).replace("https://pubalifr.sojump.com", a).replace("http://pubali.sojump.com", a).replace("https://pubali.sojump.com", a);
        }
    }
}

var hasConfirmBtn = false;

function showAnswer(b, d) {
    if (!window.isChuangGuan) {
        return;
    }
    if (b.attr("ceshi") != "1") {
        return;
    }
    var a = $(b)[0];
    if (a.confirmButton) {
        return;
    }
    var c = document.createElement("a");
    c.style.marginTop = "5px";
    c.className = "sumitbutton cancle";
    a.insertBefore(c, a.lastChild);
    a.confirmButton = c;
    c.innerHTML = "确认";
    c.onclick = function () {
        if (!hasConfirmBtn) {
            if (!confirm("确认后答案将无法修改，确认吗？")) {
                return;
            }
        }
        a.hasConfirm = true;
        hasConfirmBtn = true;
        var i = true;
        var h = "";
        d.each(function () {
            var j = this.getAttribute("ans") == "1";
            var k = $("input", this)[0];
            if (j) {
                if (!k.checked) {
                    i = false;
                }
                var l = $(".label", this).html();
                if (/^[A-Z][\.、．\s]/.test(l)) {
                    l = l.substring(0, 1);
                }
                if (h) {
                    h += ",";
                }
                h += l;
            } else {
                if (k.checked) {
                    i = false;
                }
            }
        });
        if (!a.correctAnswer) {
            var g = document.createElement("div");
            g.style.marginTop = "10px";
            a.insertBefore(g, a.lastChild);
            a.correctAnswer = g;
        }
        var e = i ? "<span style='color:green;'>回答正确</span>" : "<span style='color:red;'>回答错误，正确答案为：" + h + "</span>";
        a.correctAnswer.innerHTML = e;
        var f = document.getElementById("divjx" + a.id.replace("div", ""));
        if (f) {
            f.style.display = "";
        }
    };
}

function restoreAnswer() {
    if (!window.localStorage) {
        return null;
    }
    var c = localStorage.wjxtempanswerid;
    if (c != activityId) {
        return null;
    }
    if (window.randomMode) {
        return;
    }
    var a = "wjxtempanswer";
    var h = localStorage[a];
    if (!h) {
        return null;
    }
    var b = localStorage.wjxtempanswerdat;
    if (!b) {
        return null;
    }
    var j = window.qBeginDate || 0;
    if (b - j < 0) {
        return null;
    }
    var f = h.split(spChars[1]);
    var g = new Array();
    for (var e = 0; e < f.length; e++) {
        var d = f[e].split(spChars[0]);
        var k = new Object();
        k._value = d[1];
        k._topic = d[0];
        g.push(k);
    }
    return g;
}

function saveAnswer(d) {
    if (!window.localStorage) {
        return;
    }
    if (!window.needSaveJoin) {
        return;
    }
    if (window.randomMode) {
        return;
    }
    try {
        var b = "wjxtempanswer";
        var k = localStorage[b];
        var f = restoreAnswer();
        if (f == null) {
            f = new Array();
        }
        var e = getTopic(d);
        var m = new Object();
        var j = $(d).attr("type");
        m._topic = e;
        m._value = "";
        getAnswer(d, m, j, true);
        var h = false;
        for (var c = 0; c < f.length; c++) {
            if (f[c]._topic == m._topic) {
                h = true;
                f[c]._value = m._value;
                break;
            }
        }
        if (!h) {
            f.push(m);
        }
        f.sort(function (n, i) {
            return n._topic - i._topic;
        });
        var l = "";
        for (c = 0; c < f.length; c++) {
            if (c > 0) {
                l += spChars[1];
            }
            l += f[c]._topic;
            l += spChars[0];
            l += f[c]._value;
        }
        saveSubmitAnswer(l);
    } catch (g) {
    }
}

function saveSubmitAnswer(a) {
    if (!window.localStorage) {
        return;
    }
    localStorage.setItem("wjxtempanswer", a);
    localStorage.setItem("wjxtempanswerid", activityId);
    localStorage.setItem("wjxtempanswerdat", new Date().getTime());
    localStorage.setItem("wjxfirstloadtime", fisrtLoadTime);
    localStorage.setItem("wjxsavepage", cur_page);
}

function clearAnswer() {
    if (!window.localStorage) {
        return;
    }
    var a = localStorage.wjxtempanswerid;
    if (a != activityId) {
        return;
    }
    localStorage.removeItem("wjxtempanswer");
    localStorage.removeItem("wjxtempanswerid");
    localStorage.removeItem("wjxtempanswerdat");
    localStorage.removeItem("wjxfirstloadtime");
    localStorage.removeItem("wjxlastcosttime");
}

function loadAnswer() {
    var g = restoreAnswer();
    if (g == null) {
        return;
    }
    if (localStorage.wjxfirstloadtime) {
        lastCostTime = localStorage.wjxtempanswerdat - localStorage.wjxfirstloadtime;
        if (localStorage.wjxlastcosttime) {
            lastCostTime += parseInt(localStorage.wjxlastcosttime);
        }
        localStorage.setItem("wjxlastcosttime", lastCostTime);
    }
    isLoadingAnswer = true;
    var r = localStorage.wjxsavepage;
    for (var x = 0; x < g.length; x++) {
        var t = g[x]._topic;
        var C = g[x]._value;
        if (!C) {
            continue;
        }
        var q = $("#div" + t);
        if (q[0].style.display == "none") {
            continue;
        }
        cur_page = q[0].pageIndex || 0;
        var A = $(q).attr("type");
        switch (A) {
            case"1":
                $("input", q).val(C).trigger("blur");
                break;
            case"2":
                $("textarea", q).val(C).trigger("blur");
                break;
            case"3":
                var w = C.split(spChars[2]);
                $("input", q).each(function () {
                    if (this.type == "radio" && this.value == w[0]) {
                        if (w[1]) {
                            var a = $(this).attr("rel");
                            if (a) {
                                $("#" + a).val(w[1]);
                            }
                        }
                        q[0].prevRadio = this;
                        $(this.parentNode.parentNode).trigger("click");
                    }
                });
                break;
            case"4":
                var u = C.split(spChars[3]);
                $("input", q).each(function () {
                    if (this.type != "checkbox") {
                        return true;
                    }
                    var E = this.value;
                    for (var j = 0; j < u.length; j++) {
                        var D = u[j].split(spChars[2]);
                        if (D[0] == E) {
                            if (D[1]) {
                                var a = $(this).attr("rel");
                                if (a) {
                                    $("#" + a).val(D[1])[0].pvalue = D[1];
                                }
                            }
                            $(this.parentNode.parentNode).trigger("click");
                            break;
                        }
                    }
                });
                break;
            case"5":
                $(".rate-off", q).each(function () {
                    if (this.getAttribute("val") == C) {
                        $(this).parent().trigger("click");
                    }
                });
                break;
            case"7":
                $("select", q).val(C).trigger("change");
                break;
            case"11":
                var u = C.split(",");
                $("input", q).each(function () {
                    if (this.type != "hidden") {
                        return true;
                    }
                    var E = this.value;
                    for (var j = 0; j < u.length; j++) {
                        var D = u[j].split(spChars[2]);
                        if (D[0] == E) {
                            if (D[1]) {
                                var a = $(this).attr("rel");
                                if (a) {
                                    $("#" + a).val(D[1])[0].pvalue = D[1];
                                }
                            }
                            $(this.parentNode).trigger("click");
                            break;
                        }
                    }
                });
                break;
            case"8":
                var y = $("input", q);
                y.val(C);
                var b = q.attr("hasjump");
                if (b) {
                    $(y).trigger("change");
                }
                break;
            case"21":
                var u = C.split(spChars[3]);
                var h = $("input", q);
                for (var v = 0; v < u.length; v++) {
                    var d = u[v].split(spChars[2]);
                    var s = parseInt(d[0]) - 1;
                    $(h[s]).val(d[1]);
                }
                updateCart(q);
                break;
            case"12":
            case"9":
                var e = C.split(spChars[2]);
                var k = new Object();
                for (var v = 0; v < e.length; v++) {
                    var l = e[v].split(spChars[4]);
                    if (l.length == 2) {
                        k[l[0]] = l[1];
                    }
                }
                var b = q.attr("hasjump");
                $("input", q).each(function (D) {
                    var a = $(this);
                    if (A == "12" && window.hasReferClient) {
                        var E = this.parentNode.parentNode.parentNode;
                        if (E && E.style.display == "none") {
                            return true;
                        }
                    }
                    var F = a.attr("rowid");
                    if (!F) {
                        a.val(e[D]);
                    } else {
                        var j = k[F];
                        a.val(j);
                    }
                    if (a.attr("verify") == "指定选项") {
                        if (a.val()) {
                            a.next().find("select").val(a.val()).trigger("change");
                        }
                    }
                    $(a).trigger("change");
                });
                break;
            case"13":
                q[0].fileName = C || "";
                if (C) {
                    $(".uploadmsg", q).html("文件已经成功上传！");
                }
                break;
            case"10":
                var e = C.split(spChars[2]);
                var k = new Object();
                for (var v = 0; v < e.length; v++) {
                    var l = e[v].split(spChars[4]);
                    if (l.length == 2) {
                        k[l[0]] = l[1];
                    }
                }
                var o = "input";
                var z = false;
                if (q.attr("select") == "1") {
                    o = "select";
                    z = true;
                }
                var b = q.attr("hasjump");
                $("table", q).each(function () {
                    var F = this;
                    if (window.hasReferClient) {
                        var E = F.parentNode;
                        if (E && E.style.display == "none") {
                            return true;
                        }
                    }
                    var D = F.parentNode.getAttribute("rowid");
                    var i = k[D];
                    var j = i.split(spChars[3]);
                    var a = 0;
                    $(o, this).each(function () {
                        this.value = j[a] || "";
                        if (z) {
                            $(this).trigger("change");
                        } else {
                            if (b) {
                                $(this).trigger("change");
                            }
                        }
                        a++;
                    });
                });
                break;
            case"6":
                var e = C.split(",");
                var k = new Object();
                for (var v = 0; v < e.length; v++) {
                    var l = e[v].split(spChars[4]);
                    if (l.length == 2) {
                        k[l[0]] = l[1];
                    }
                }
                var B = $(q).attr("ischeck");
                var m = $("table.matrix-rating", q);
                var p = m[0].rows;
                for (var v = 0; v < p.length; v++) {
                    var c = p[v];
                    var f = c.getAttribute("tp");
                    if (f != "d") {
                        continue;
                    }
                    if (window.hasReferClient && c.style.display == "none") {
                        continue;
                    }
                    var n = parseInt(c.getAttribute("rowindex")) + 1;
                    var l = e[n];
                    $(".rate-off", c).each(function () {
                        var D = $(this).attr("dval");
                        if (B) {
                            var E = k[n].split(";");
                            for (var j = 0; j < E.length; j++) {
                                var a = E[j].split(spChars[2]);
                                if (D == a[0]) {
                                    if (a[1]) {
                                        this.fillvalue = a[1];
                                    }
                                    $(this).trigger("click");
                                }
                            }
                        } else {
                            var E = k[n].split(spChars[2]);
                            if (D == E[0]) {
                                if (E[1]) {
                                    this.fillvalue = E[1];
                                }
                                $(this).trigger("click");
                            }
                        }
                    });
                }
                break;
        }
    }
    cur_page = 0;
    if (r && r >= cur_page + 1) {
        pageHolder[0].style.display = "none";
        cur_page = r - 1;
        localStorage.setItem("wjxsavepage", r);
        show_next_page();
    }
    isLoadingAnswer = false;
}

function needTip() {
    if (window.divTip && divTip.style.display == "") {
        var a = $.trim($(divTip).text());
        if (a) {
            return true;
        }
    }
    return false;
}

function checkAnswer() {
    if (window.needSaveJoin) {
        loadAnswer();
    } else {
        if (window.localStorage && !needTip()) {
            var a = restoreAnswer();
            if (a) {
                $("#divLoadAnswer").show();
            }
        }
    }
}

function hideAward() {
    if (!confirm("确认不再领取吗？")) {
        return;
    }
    if (window.localStorage) {
        vkey = "award_" + activityId;
        localStorage.removeItem(vkey);
        localStorage.removeItem(vkey + "name");
        localStorage.removeItem(vkey + "tip");
    }
    $("#divContent").show().prev().hide();
    initSlider();
}

function processAward() {
    var b = "join_" + activityId;
    if (!document.cookie || document.cookie.indexOf(b + "=") == -1) {
        return;
    }
    b = "award_" + activityId;
    var d = "";
    var a = "";
    if (window.localStorage) {
        d = localStorage[b];
        a = localStorage[b + "name"];
    }
    if (d && d.indexOf("http") == 0) {
        var c = localStorage[b + "tip"];
        var f = "";
        if (c) {
            f = " onclick='alert(\"" + c + "\");return true;' ";
        }
        var e = "<div style='margin:10px 12px;'>恭喜您抽中了" + a + "，如已领取请忽略！<br/><div style='text-align:center;'><a href='" + d + "'" + f + " class='button white' target='_blank' style='color:#fff; background:#e87814;'>立即领取</a></div><div style='margin-top:18px;text-align:center;'><a href='javascript:' onclick='hideAward();' style='color:#666;font-size:14px;'>不领取，重新填写问卷</a></div></div>";
        $("#divContent").before(e);
        $("#divContent").hide();
    }
}

function postHeight() {
    if (window == window.top) {
        return;
    }
    try {
        var c = parent.postMessage ? parent : parent.document.postMessage ? parent.document : null;
        if (c != null) {
            var a = $("body").height();
            return c.postMessage("heightChanged," + a, "*");
        }
    } catch (b) {
    }
}

function saveMatrixFill(b, a) {
    if (!window.needSaveJoin) {
        return;
    }
    var c = b.parentNode.parentNode;
    var e = c.getAttribute("fid");
    if (!e) {
        return;
    }
    var d = "";
    if (a) {
        $(".rate-on", c).each(function () {
            if (d) {
                d += ";";
            }
            d += $(this).attr("dval");
            if (this.fillvalue) {
                var g = replace_specialChar(this.fillvalue).replace(/;/g, "；").replace(/,/g, "，");
                d += spChars[2] + g;
            }
        });
    } else {
        d = $(b).attr("dval");
        if (b.fillvalue) {
            var f = replace_specialChar(b.fillvalue).replace(/;/g, "；").replace(/,/g, "，");
            d += spChars[2] + f;
        }
    }
    $("#" + e).val(d);
}

function saveLikert(a) {
    var b = $("a.rate-on", a);
    if (b.length == 0) {
        $("input:hidden", a).val("");
    } else {
        $("input:hidden", a).attr("value", $(b[b.length - 1]).attr("val"));
    }
}

function initRate(a, b) {
    $(".rate-off", a).parent().bind("click", function (k) {
        var c = $(a).attr("ischeck");
        var f = $("a", this)[0];
        if (c) {
            var h = true;
            var n = $(a).attr("maxvalue");
            if (n && !$(f).hasClass("rate-on")) {
                var m = $("a.rate-on", this.parentNode);
                if (n - m.length <= 0) {
                    h = false;
                }
            }
            if (h) {
                $(f).toggleClass("rate-on");
                $(f).toggleClass("rate-onchk");
                $(f).trigger("change");
            }
        } else {
            var g = $(this.parentNode).find("a.rate-off");
            g.removeClass("rate-on");
            var j = $(f).attr("mode");
            if (j) {
                g.removeClass("rate-on" + j);
                var l = f;
                g.each(function () {
                    $(this).toggleClass("rate-on");
                    $(this).toggleClass("rate-on" + j);
                    if (this == l) {
                        return false;
                    }
                });
            } else {
                $(f).toggleClass("rate-on");
                if (!$(f).text()) {
                    g.removeClass("rate-ontxt");
                    $(f).toggleClass("rate-ontxt");
                }
            }
            $(f).trigger("change");
        }
        if ($(f).hasClass("rate-on")) {
            var j = $(f).attr("mode");
            if (!j) {
                var i = $(f).attr("needfill");
                if (i && !isLoadingAnswer) {
                    showMatrixFill(f);
                    k.stopPropagation();
                }
            }
            showMatrixHeader(f, a);
        }
        if (a.attr("type") == "5") {
            displayRelationByType(a, "a.rate-off", 4);
        }
        jump(a, f);
        if (a.attr("req") != "1") {
            addClearHref(a);
        }
        $("span.error", a).is(":visible") && validateQ(a);
        if (b) {
            saveMatrixFill(f, c);
        } else {
            saveLikert(a, this);
        }
        saveAnswer(a);
        k.preventDefault();
    });
}

function updateCart(c) {
    var k = $("#divQuestion");
    var f = "";
    var h = 0;
    var j = 0;
    var d = null;
    if (shopArray.length > 0) {
        var a = "";
        for (var e = 0; e < shopArray.length; e++) {
            if (shopArray[e].style.display == "none") {
                continue;
            }
            var b = $(shopArray[e]).attr("id");
            if (a) {
                a += ",";
            }
            a += "#" + b;
        }
        if (a) {
            var g = $(a);
            d = $(".shop-item", g);
        }
    } else {
        d = $(".shop-item", k);
    }
    d.each(function () {
        var l = $(".itemnum", this);
        var o = parseInt(l.val());
        if (o == 0) {
            return true;
        }
        var p = $(".item_name", this).html();
        var m = $(".item_price", this).attr("price");
        var n = o * parseFloat(m);
        var i = '<li class="productitem"><span class="fpname">' + p + '</span><span class="fpnum">' + o + '</span><span class="fpprice">￥' + toFixed0d(n) + "</span></li>";
        f += i;
        h += n;
        j += o;
    });
    f = "<ul class='productslist'>" + f + '<li class="productitem"><span class="fpname"></span><span class="fpnum" style="font-weight:bold;">' + j + '</span><span class="fpprice" style="font-weight:bold;">￥' + toFixed0d(h, 2) + "</span></li></ul>";
    $("#shopcart").html(f);
    if (h > 0) {
        $("#shopcart").show();
    } else {
        $("#shopcart").hide();
    }
    saveAnswer(c);
}

function toFixed0d(a) {
    return a.toFixed(2).replace(".00", "");
}

function setVerifyCode() {
    if (tCode && tCode.style.display != "none") {
        submit_text.value = validate_info_submit_title3;
        submit_text.onblur = function () {
            if (submit_text.value == "") {
                submit_text.value = validate_info_submit_title3;
            }
        };
        submit_text.onfocus = function () {
            if (submit_text.value == validate_info_submit_title3) {
                submit_text.value = "";
            }
        };
        imgCode.style.display = "none";
        submit_text.onclick = function () {
            if (!needAvoidCrack && imgCode.style.display == "none") {
                imgCode.style.display = "";
                imgCode.onclick = refresh_validate;
                imgCode.onclick();
                imgCode.title = validate_info_submit_title1;
            } else {
                if (needAvoidCrack && !imgVerify) {
                    var c = $("#divCaptcha")[0];
                    c.style.display = "";
                    imgVerify = c.getElementsByTagName("img")[0];
                    imgVerify.style.cursor = "pointer";
                    imgVerify.onclick = function () {
                        var h = new Date();
                        var e = h.getTime() + (h.getTimezoneOffset() * 60000);
                        var f = window.location.host || "www.sojump.com";
                        var g = "//" + f + "/botdetect/" + activityId + ".aspx?get=image&c=" + this.captchaId + "&t=" + this.instanceId + "&d=" + e;
                        this.src = g;
                    };
                    var a = imgVerify.getAttribute("captchaid");
                    var b = imgVerify.getAttribute("instanceid");
                    imgVerify.captchaId = a;
                    imgVerify.instanceId = b;
                    imgVerify.onclick();
                }
            }
        };
    }
}

function fixBottom() {
    $("#spanPower").click(function () {
        window.location.href = "https://www.wjx.cn/mobile/index.aspx";
    });
    postHeight();
    var a = $("body").height() - $(window).height();
    if (a < 0) {
        $(".logofooter").addClass("fixedbottom");
    } else {
        $(".logofooter").removeClass("fixedbottom");
    }
}

var firstError = null;
var firstMatrixError = null;
var needSubmitNotValid = false;

function validate() {
    var b = true;
    firstError = null;
    firstMatrixError = null;
    curMatrixError = null;
    $(".field:visible").each(function () {
        var e = pageHolder[cur_page].hasExceedTime;
        if (e) {
            return true;
        }
        var d = $(this), a = validateQ(d);
        if (!a) {
            b = false;
        }
    });
    if (!b) {
        if (firstError) {
            $("html, body").animate({scrollTop: $(firstError).offset().top}, 600);
            $(".scrolltop").show();
            $(".scrolltop").click(function () {
                $("html, body").animate({scrollTop: $(document).height()}, 600);
                $(".scrolltop").hide();
            });
        }
    } else {
    }
    return b;
}

var txtCurCity = null;

function openCityBox(g, f, d, h) {
    txtCurCity = g;
    var e = "";
    h = h || "";
    var b = 400;
    if (f == 3) {
        var a = g.getAttribute("province");
        var c = "";
        if (a) {
            c = "&pv=" + encodeURIComponent(a);
        }
        e = "https://www.wjx.cn/wjx/design/setcitycountymobo2.aspx?activityid=" + activityId + "&ct=" + f + c + "&pos=" + h;
        b = 300;
    } else {
        if (f == 4) {
            var a = g.getAttribute("province");
            var c = "";
            if (a) {
                c = "&pv=" + encodeURIComponent(a);
            }
            e = "/wjx/design/school.aspx?activityid=" + activityId + "&ct=" + f + c + "&pos=" + h;
        } else {
            if (f == 5) {
                e = "/wjx/design/setmenusel.aspx?activityid=" + activityId + "&ct=" + f + "&pos=" + h;
            } else {
                if (f == 6) {
                    e = "/wjx/join/amap.aspx?activityid=" + activityId + "&ct=" + f + "&pos=" + h;
                    if ($(g).attr("needonly") == "1") {
                        e += "&nc=1";
                        if (g.value) {
                            $(g.parentNode.parentNode).find(".errorMessage").html("提示：定位后无法修改。");
                            return;
                        }
                    }
                } else {
                    e = "/wjx/design/setcitymobo2.aspx?activityid=" + activityId + "&ct=" + f + "&pos=" + h;
                    b = 250;
                }
            }
        }
    }
    g.blur();
    openDialogByIframe(400, b, e);
}

function showItemDesc(c, i, b, d) {
    var a = document.getElementById(b);
    var e = $.trim(a.innerHTML);
    if (e.indexOf("http") == 0) {
        openDialogByIframe(c, i, e, true);
    } else {
        a.style.display = "";
        a.style.width = (Math.min($(window).width(), 400) - 50) + "px";
        var g = a.offsetHeight + 20;
        a.style.display = "none";
        var h = $(window).height() - 30;
        var f = true;
        if (g < h && g > 30) {
            i = g;
            f = false;
        }
        openDialogByIframe(c, i, b, f);
    }
}

function setCityBox(b) {
    txtCurCity.value = b;
    $("#yz_popTanChuClose").click();
    if (window.needSaveJoin) {
        var a = $(txtCurCity).parents(".field");
        saveAnswer(a);
    }
}

var startAge = 0;
var endAge = 0;
var rName = "";
var gender = 0;
var marriage = 0;
var education = "";

function getRname(d, b, g) {
    if (rName) {
        return;
    }
    if (d != "1") {
        if (d == "9") {
            var e = b[0].getElementsByTagName("th");
            for (var f = 0; f < e.length; f++) {
                if (e[f].innerHTML.indexOf("姓名") > -1 || (e[f].innerHTML.indexOf("姓") > -1 && e[f].innerHTML.indexOf("名") > -1)) {
                    var c = e[f].parentNode.getElementsByTagName("input");
                    if (c[0]) {
                        rName = c[0].value;
                    }
                    break;
                }
            }
        }
        return;
    }
    if (g.indexOf("姓名") == -1) {
        return;
    }
    rName = $("input:text", b).val();
}

function getGender(d, c, e, b) {
    if (d != "3") {
        return;
    }
    if (e.indexOf("性别") == -1) {
        return;
    }
    b.each(function (a) {
        if (this.checked) {
            var f = $(this.parentNode.parentNode).find(".label").html();
            if (f.indexOf("男") > -1) {
                gender = 1;
            } else {
                if (f.indexOf("女") > -1) {
                    gender = 2;
                }
            }
            return false;
        }
    });
}

function getMarriage(d, c, e, b) {
    if (d != "3") {
        return;
    }
    if (e.indexOf("婚姻") == -1) {
        return;
    }
    if (marriage) {
        return;
    }
    b.each(function (a) {
        if (this.checked) {
            var f = $(this.parentNode.parentNode).find(".label").html();
            if (f.indexOf("未婚") > -1) {
                marriage = 1;
            } else {
                if (f.indexOf("已婚") > -1 || f.indexOf("离异") > -1) {
                    marriage = 2;
                }
            }
            return false;
        }
    });
}

function getEducation(d, c, e, b) {
    if (d != "3") {
        return;
    }
    if (e.indexOf("学历") == -1 && e.indexOf("学位") == -1) {
        return;
    }
    if (education) {
        return;
    }
    b.each(function (a) {
        if (this.checked) {
            var f = $(this.parentNode.parentNode).find(".label").html();
            if (f.indexOf("硕士") > -1 || f.indexOf("博士") > -1 || f.indexOf("研究生") > -1) {
                education = 5;
            } else {
                if (f.indexOf("本科") > -1) {
                    education = 4;
                } else {
                    if (f.indexOf("大专") > -1 || f.indexOf("专科") > -1) {
                        education = 3;
                    } else {
                        if (f.indexOf("高中") > -1 || f.indexOf("中专") > -1 || f.indexOf("职高") > -1) {
                            education = 2;
                        } else {
                            if (f.indexOf("初中") > -1 || f.indexOf("小学") > -1) {
                                education = 1;
                            }
                        }
                    }
                }
            }
            return false;
        }
    });
}

function checkJpMatch(c, b) {
    if (jpmatch) {
        return;
    }
    if (b.hasCheck) {
        return;
    }
    b.hasCheck = true;
    var f = $("div.field-label", b).html();
    var e = matchJp(f);
    if (e) {
        jpmatch = e;
        return;
    }
    if (c != "3" && c != "4") {
        return;
    }
    var d = $("div.label", b);
    d.each(function (g) {
        var a = this.innerHTML;
        e = matchJp(a);
        if (e) {
            jpmatch = e;
            return false;
        }
    });
}

function checkTitleDescMatch() {
    var c = document.title || "";
    var b = $("#divDesc").text();
    var a = matchJp(c + b);
    if (a) {
        jpmatch = a;
        return;
    }
}

function matchJp(c) {
    for (var a = 0; a < jpkeyword.length; a++) {
        var b = jpkeyword[a];
        if (c && c.indexOf(b) > -1) {
            return 1;
        }
    }
    for (var a = 0; a < enkeyword.length; a++) {
        var b = enkeyword[a];
        if (c && c.indexOf(b) > -1) {
            return 2;
        }
    }
    for (var a = 0; a < enhighkeyword.length; a++) {
        var b = enhighkeyword[a];
        if (c && c.indexOf(b) > -1) {
            return 3;
        }
    }
    for (var a = 0; a < enmiddlekeyword.length; a++) {
        var b = enmiddlekeyword[a];
        if (c && c.indexOf(b) > -1) {
            return 4;
        }
    }
    for (var a = 0; a < enmiddlexiaokeyword.length; a++) {
        var b = enmiddlexiaokeyword[a];
        if (c && c.indexOf(b) > -1) {
            return 5;
        }
    }
    for (var a = 0; a < enxiaokeyword.length; a++) {
        var b = enxiaokeyword[a];
        if (c && c.indexOf(b) > -1) {
            return 6;
        }
    }
    for (var a = 0; a < enyouerkeyword.length; a++) {
        var b = enyouerkeyword[a];
        if (c && c.indexOf(b) > -1) {
            return 7;
        }
    }
    for (var a = 0; a < enforeinkeyword.length; a++) {
        var b = enforeinkeyword[a];
        if (c && c.indexOf(b) > -1) {
            return 8;
        }
    }
    for (var a = 0; a < enninekeyword.length; a++) {
        var b = enninekeyword[a];
        if (c && c.indexOf(b) > -1) {
            return 9;
        }
    }
    for (var a = 0; a < entenkeyword.length; a++) {
        var b = entenkeyword[a];
        if (c && c.indexOf(b) > -1) {
            return 10;
        }
    }
    for (var a = 0; a < en11keyword.length; a++) {
        var b = en11keyword[a];
        if (c && c.indexOf(b) > -1) {
            return 11;
        }
    }
    for (var a = 0; a < en12keyword.length; a++) {
        var b = en12keyword[a];
        if (c && c.indexOf(b) > -1) {
            return 12;
        }
    }
    return 0;
}

function getAge(i, h, f, j) {
    if (i != "3" && i != "7") {
        return;
    }
    if (f.indexOf("年龄") == -1) {
        return;
    }
    var b = "";
    var g = 0;
    if (i == 3) {
        j.each(function (a) {
            if (this.checked) {
                b = $(this.parentNode.parentNode).find(".label").html();
                g = a;
                return false;
            }
        });
    } else {
        if (i == 7) {
            var e = $("select", h)[0];
            b = e.options[e.selectedIndex].text;
            g = e.selectedIndex - 1;
        }
    }
    if (!b) {
        return;
    }
    var d = /[1-9][0-9]*/g;
    var c = b.match(d);
    if (!c || c.length == 0) {
        return;
    }
    if (c.length > 2) {
        return;
    }
    if (c.length == 2) {
        startAge = c[0];
        endAge = c[1];
    } else {
        if (c.length == 1) {
            if (g == 0) {
                endAge = c[0];
            } else {
                startAge = c[0];
            }
        }
    }
}

function getAnswer(g, o, k, h) {
    var l = 0;
    switch (k) {
        case"1":
            if (!h) {
                o._value = "(跳过)";
                if (g.attr("hrq") == "1") {
                    o._value = "Ⅳ";
                }
                break;
            }
            var e = $("input", g);
            var c = $.trim(e.val());
            if (c && e[0].lnglat) {
                c = c + "[" + e[0].lnglat + "]";
            }
            o._value = replace_specialChar(c);
            if (!o._value && g.attr("req") == "1") {
                debugLog("题目答案为空：" + o._value + "," + c);
            }
            break;
        case"2":
            if (!h) {
                o._value = "(跳过)";
                if (g.attr("hrq") == "1") {
                    o._value = "Ⅳ";
                }
                break;
            }
            var e = $("textarea", g);
            var c = e.val();
            if (c && e[0].lnglat) {
                c = c + "[" + e[0].lnglat + "]";
            }
            o._value = replace_specialChar(c);
            break;
        case"3":
            if (!h) {
                o._value = "-3";
                if (g.attr("hrq") == "1") {
                    o._value = "-4";
                }
                break;
            }
            $("input[type='radio']:checked", g).each(function (p) {
                o._value = $(this).val();
                var a = $(this).attr("rel");
                if (a && $("#" + a).val().length > 0) {
                    o._value += spChars[2] + replace_specialChar($("#" + a).val().substring(0, 3000));
                }
                return false;
            });
            break;
        case"4":
            if (!h) {
                o._value = "-3";
                if (g.attr("hrq") == "1") {
                    o._value = "-4";
                }
                break;
            }
            var j = 0;
            $("input:checked", g).each(function () {
                var p = this.parentNode.parentNode.style.display == "none";
                if (!p) {
                    if (j > 0) {
                        o._value += spChars[3];
                    }
                    o._value += $(this).val();
                    var a = $(this).attr("rel");
                    if (a && $("#" + a).val().length > 0) {
                        o._value += spChars[2] + replace_specialChar($("#" + a).val().substring(0, 3000));
                    }
                    j++;
                }
            });
            if (j == 0) {
                o._value = "-2";
            }
            break;
        case"21":
            if (!h) {
                o._value = "-3";
                break;
            }
            var j = 0;
            $(".shop-item .itemnum", g).each(function (a) {
                var p = $(this).val();
                if (p != "0") {
                    if (j > 0) {
                        o._value += spChars[3];
                    }
                    o._value += (a + 1);
                    o._value += spChars[2] + p;
                    j++;
                }
            });
            if (j == 0) {
                o._value = "-2";
            }
            break;
        case"11":
            var d = new Array();
            $("li.ui-li-static", g).each(function () {
                var p = $(this).find("span.sortnum").html();
                var q = new Object();
                q.sIndex = p;
                var r = $(this).find("input:hidden").val();
                var a = $(this).find("input.OtherText");
                if (a.length > 0 && a.val().length > 0) {
                    r += spChars[2] + replace_specialChar(a.val().substring(0, 3000));
                }
                if (!h) {
                    r = "-3";
                } else {
                    if (!p) {
                        r = "-2";
                    }
                }
                q.val = r;
                if (!q.sIndex) {
                    q.sIndex = 10000;
                }
                d.push(q);
            });
            d.sort(function (q, p) {
                return q.sIndex - p.sIndex;
            });
            for (var f = 0; f < d.length; f++) {
                if (f > 0) {
                    o._value += ",";
                }
                o._value += d[f].val;
            }
            break;
        case"5":
            if (!h) {
                o._value = "-3";
                break;
            }
            o._value = $("input:hidden", g).val();
            break;
        case"6":
            l = 0;
            $("input:hidden", g).each(function (p) {
                if (l > 0) {
                    o._value += ",";
                }
                var q = false;
                var t = (p + 1);
                if (window.hasReferClient) {
                    var s = $(g).attr("id");
                    var r = o._topic;
                    if (s) {
                        var a = s.replace("div", "");
                        if (parseInt(a) == a && r != a) {
                            r = a;
                        }
                    }
                    var u = document.getElementById("drv" + r + "_" + (p + 1));
                    if (u && u.style.display == "none") {
                        q = true;
                    } else {
                        if (!u && questionsObject[o._topic]) {
                            q = true;
                        }
                    }
                }
                o._value += t + spChars[4];
                if (!h) {
                    o._value += "-3";
                } else {
                    var v = $(this).val();
                    if (!v) {
                        v = "-2";
                    }
                    if (q) {
                        v = "-4";
                    }
                    o._value += v;
                }
                l++;
            });
            break;
        case"7":
            if (!h) {
                o._value = "-3";
                break;
            }
            o._value = $("select", g).val();
            break;
        case"8":
            if (!h) {
                o._value = "(跳过)";
                break;
            }
            o._value = $("input.ui-slider-input", g).val();
            break;
        case"9":
            l = 0;
            if (!h && g.attr("hrq") == "1") {
                o._value = "Ⅳ";
                break;
            }
            var m = $("input", g);
            if (g.attr("randomrow") == "1") {
                var i = g.attr("topic");
                m = m.toArray().sort(function (r, q) {
                    var p = $(r).attr("id").replace("q" + i + "_", "");
                    var s = $(q).attr("id").replace("q" + i + "_", "");
                    return p - s;
                });
            }
            $(m).each(function () {
                if (l > 0) {
                    o._value += spChars[2];
                }
                var p = this.getAttribute("rowid");
                if (p) {
                    o._value += p + spChars[4];
                }
                var r = $(this).val();
                var a = false;
                if (window.hasReferClient) {
                    var q = this.parentNode.parentNode.parentNode;
                    if (q && q.tagName == "TR" && q.style.display == "none") {
                        a = true;
                    }
                }
                if (!h) {
                    r = "(跳过)";
                } else {
                    if (a) {
                        r = "Ⅳ";
                    }
                }
                if (r && this.lnglat) {
                    r = r + "[" + this.lnglat + "]";
                }
                o._value += replace_specialChar(r);
                l++;
            });
            break;
        case"12":
            l = 0;
            $("input", g).each(function () {
                if (l > 0) {
                    o._value += spChars[2];
                }
                var a = false;
                if (window.hasReferClient) {
                    var r = this.parentNode.parentNode.parentNode;
                    if (r && r.style.display == "none") {
                        a = true;
                    }
                }
                var p = this.getAttribute("rowid");
                if (p) {
                    o._value += p + spChars[4];
                }
                var q = $(this).val();
                if (!h) {
                    q = "(跳过)";
                } else {
                    if (a) {
                        q = "Ⅳ";
                    }
                }
                o._value += q;
                l++;
            });
            break;
        case"13":
            if (!h) {
                o._value = "(跳过)";
                break;
            }
            o._value = $(g)[0].fileName || "";
            break;
        case"10":
            l = 0;
            var n = "input";
            var b = "(跳过)";
            if (g.attr("select") == "1") {
                n = "select";
                b = "-3";
            }
            $("table", g).each(function () {
                var s = this;
                if (l > 0) {
                    o._value += spChars[2];
                }
                var a = 0;
                var p = false;
                if (window.hasReferClient) {
                    var r = s.parentNode;
                    if (r && r.style.display == "none") {
                        p = true;
                    }
                }
                var q = s.parentNode.getAttribute("rowid");
                if (q) {
                    o._value += q + spChars[4];
                }
                $(n, this).each(function () {
                    if (a > 0) {
                        o._value += spChars[3];
                    }
                    var t = this;
                    var u = t.value;
                    if (!h) {
                        u = b;
                    } else {
                        if (p) {
                            u = "Ⅳ";
                        }
                    }
                    if (u && t.lnglat) {
                        u = u + "[" + t.lnglat + "]";
                    }
                    o._value += replace_specialChar(u);
                    a++;
                });
                l++;
            });
            break;
    }
}

function debugLog(a) {
    if (window.debug && window.debug.log) {
        debug.log(a);
    }
}

var clientAnswerSend = "";

function groupAnswer(q) {
    var c = new Array();
    var w = 0;
    var n = new Object();
    var g = 1;
    debugLog("获取题目答案");
    allQArray.each(function () {
        var H = $(this);
        var G = new Object();
        var D = H.attr("type");
        var i = this.style.display != "none";
        if (i && hasSkipPage) {
            if (this.pageParent && this.pageParent.skipPage) {
                i = false;
            }
        }
        if (this.isCepingQ) {
            i = true;
        }
        G._value = "";
        G._topic = getTopic(H);
        if (window.isKaoShi && window.randomMode && H.attr("nc") != "1") {
            n[G._topic] = g;
            g++;
        }
        c[w++] = G;
        try {
            var F = $("div.field-label", H).html();
            if (D == "3" || D == "7") {
                var e = null;
                if (D == "3") {
                    e = $("input[type='radio']", H);
                }
                getAge(D, H, F, e);
                if (D == "3") {
                    getGender(D, H, F, e);
                    getMarriage(D, H, F, e);
                    getEducation(D, H, F, e);
                }
            }
            getRname(D, H, F);
        } catch (E) {
        }
        getAnswer(H, G, D, i);
    });
    if (c.length == 0) {
        alert("提示：此问卷没有添加题目，不能提交！");
        return;
    }
    c.sort(function (i, e) {
        return i._topic - e._topic;
    });
    var m = "";
    for (t = 0; t < c.length; t++) {
        if (t > 0) {
            m += spChars[1];
        }
        m += c[t]._topic;
        m += spChars[0];
        m += c[t]._value;
    }
    debugLog("获取提交参数");
    try {
        if (window.isKaoShi && window.randomMode && n && window.localStorage && window.JSON) {
            var k = localStorage.getItem("sortactivity");
            if (!k) {
                k = activityId;
            } else {
                k += "," + activityId;
            }
            k += "";
            var a = k.split(",");
            var h = 2;
            if (a.length > h) {
                var u = a.length;
                for (var t = 0; t < u - h; t++) {
                    var B = a[0];
                    a.splice(0, 1);
                    localStorage.removeItem("sortorder_" + B);
                }
                k = a.join(",");
            }
            localStorage.setItem("sortactivity", k);
            var C = "sortorder_" + activityId;
            localStorage.setItem(C, JSON.stringify(n));
        }
    } catch (x) {
    }
    var b = $("#form1").attr("action");
    if (b.indexOf("aliyun.sojump.com") > -1 || b.indexOf("temp.sojump.com") > -1) {
        b = b.replace("aliyun.sojump.com", window.location.host).replace("temp.sojump.com", window.location.host);
    }
    var f = b + "&starttime=" + encodeURIComponent($("#starttime").val());
    var v = window.sojumpParm;
    if (!window.hasEncode) {
        v = encodeURIComponent(v);
    }
    if (window.sojumpParm) {
        f += "&sojumpparm=" + v;
    }
    if (window.tparam) {
        f += "&tparam=1&sojumpparmext=" + encodeURIComponent(window.sojumpparmext);
    }
    if (window.Password) {
        f += "&psd=" + encodeURIComponent(Password);
    }
    if (window.PasswordExt) {
        f += "&pwdext=" + encodeURIComponent(PasswordExt);
    }
    if (window.hasMaxtime) {
        f += "&hmt=1";
    }
    if (window.initMaxSurveyTime) {
        f += "&mst=" + window.initMaxSurveyTime;
    }
    if (tCode && tCode.style.display != "none" && submit_text.value != "") {
        f += "&validate_text=" + encodeURIComponent(submit_text.value);
    }
    if (window.useAliVerify) {
        f += "&nc_csessionid=" + encodeURIComponent(nc_csessionid) + "&nc_sig=" + encodeURIComponent(nc_sig) + "&nc_token=" + encodeURIComponent(nc_token) + "&nc_scene=" + nc_scene + "&validate_text=geet";
    }
    if (window.cpid) {
        f += "&cpid=" + cpid;
    }
    if (window.guid) {
        f += "&emailguid=" + guid;
    }
    if (window.udsid) {
        f += "&udsid=" + window.udsid;
    }
    if (window.fromsour) {
        f += "&fromsour=" + window.fromsour;
    }
    if (window.isDingDing) {
        f += "&isdd=1";
        if (window.ddnickname) {
            f += "&ddnn=" + encodeURIComponent(window.ddnickname);
        }
    }
    if (nvvv) {
        f += "&nvvv=1";
    }
    if (window.sjUser) {
        f += "&sjUser=" + encodeURIComponent(sjUser);
    }
    if (window.outuser) {
        f += "&outuser=" + encodeURIComponent(outuser);
        if (window.outsign) {
            f += "&outsign=" + encodeURIComponent(outsign);
        }
    }
    if (window.sourceurl) {
        f += "&source=" + encodeURIComponent(sourceurl);
    } else {
        f += "&source=directphone";
    }
    var z = window.alipayAccount || window.cAlipayAccount;
    if (z) {
        f += "&alac=" + encodeURIComponent(z);
    }
    if (window.SJBack) {
        f += "&sjback=1";
    }
    if (window.jiFen && jiFen > 0) {
        f += "&jf=" + jiFen;
    }
    if (q) {
        f += "&submittype=" + q;
    }
    if (q == 3) {
        f += "&zbp=" + (cur_page + 1);
        if (needSubmitNotValid) {
            f += "&nsnv=1";
        }
    }
    if (window.rndnum) {
        f += "&rn=" + encodeURIComponent(rndnum);
    }
    if (imgVerify) {
        f += "&btuserinput=" + encodeURIComponent(submit_text.value);
        f += "&btcaptchaId=" + encodeURIComponent(imgVerify.captchaId);
        f += "&btinstanceId=" + encodeURIComponent(imgVerify.instanceId);
    }
    if (window.inviteid) {
        f += "&inviteid=" + encodeURIComponent(inviteid);
    }
    if (window.access_token && window.openid) {
        f += "&access_token=" + encodeURIComponent(access_token);
        if (window.isQQLogin) {
            f += "&qqopenid=" + encodeURIComponent(openid);
        } else {
            f += "&openid=" + encodeURIComponent(openid);
        }
    }
    if (window.wxUserId) {
        f += "&wxUserId=" + window.wxUserId;
    }
    if (window.wxthird) {
        f += "&wxthird=1";
    }
    if (window.parterts) {
        f += "&parterts=" + parterts;
    }
    if (window.parterjoiner) {
        f += "&parterjoiner=" + encodeURIComponent(parterjoiner);
    }
    if (window.partersign) {
        f += "&partersign=" + encodeURIComponent(partersign);
    }
    if (window.parterrealname) {
        f += "&parterrealname=" + encodeURIComponent(parterrealname);
    }
    if (window.parterextf) {
        f += "&parterextf=" + encodeURIComponent(parterextf);
    }
    if (window.isKaoShi && rName) {
        f += "&rname=" + encodeURIComponent(rName.replace("(", "（").replace(")", "）"));
    }
    if (window.relts) {
        f += "&relts=" + relts;
    }
    if (window.relusername) {
        f += "&relusername=" + encodeURIComponent(relusername);
    }
    if (window.relsign) {
        f += "&relsign=" + encodeURIComponent(relsign);
    }
    if (window.relrealname) {
        f += "&relrealname=" + encodeURIComponent(relrealname);
    }
    if (lastCostTime && lastCostTime / 1000) {
        f += "&lct=" + (parseInt(lastCostTime / 1000));
    }
    if (window.isWeiXin) {
        f += "&iwx=1";
    }
    f += "&t=" + new Date().valueOf();
    if ($("#shopcart")[0] && $("#shopcart")[0].style.display != "none") {
        f += "&ishop=1";
    }
    if (window.cProvince) {
        f += "&cp=" + encodeURIComponent(cProvince.replace("'", "")) + "&cc=" + encodeURIComponent(cCity.replace("'", "")) + "&ci=" + escape(cIp);
        var o = cProvince + "," + cCity;
        var r = window.location.host || "sojump.com";
        try {
            setCookie("ip_" + cIp, o, null, "/", "", null);
        } catch (y) {
        }
    }
    debugLog("准备提交到服务器");
    $("#ctlNext").hide();
    var A = "处理中......";
    if (langVer == 1) {
        A = "Submiting......";
    } else {
        if (langVer == 2) {
            A = "處理中...";
        }
    }
    $(".ValError").html(A);
    if (q == 3) {
        A = "正在验证，请稍候...";
        if (langVer == 1) {
            A = "Validating......";
        }
        $(".ValError").html(A);
    }
    var d = {submitdata: m};
    var l = false;
    var j = window.getMaxWidth || 1800;
    var s = encodeURIComponent(m);
    if (window.submitWithGet && s.length <= j) {
        l = true;
    }
    clientAnswerSend = m;
    debugLog("开始提交");
    if (l) {
        f += "&submitdata=" + s;
        f += "&useget=1";
    } else {
        if (window.submitWithGet) {
            window.postIframe = 1;
        }
    }
    var p = "很抱歉，网络连接异常，请重新尝试提交！";
    if (langVer == 1) {
        p = "Sorry,network error,please retry later.";
    }
    if (window.postIframe) {
        debugLog("postIframe");
        postWithIframe(f, m);
    } else {
        if (l) {
            debugLog("ajaxget");
            $.ajax({
                type: "GET", url: f, success: function (e) {
                    afterSubmit(e, q);
                }, error: function () {
                    $(".ValError").html(p);
                    $("#ctlNext").show();
                    return;
                }
            });
        } else {
            debugLog("ajaxpost");
            $.ajax({
                type: "POST", url: f, data: d, dataType: "text", success: function (e) {
                    afterSubmit(e, q);
                }, error: function () {
                    $(".ValError").html(p);
                    $("#ctlNext").show();
                    return;
                }
            });
        }
    }
}

function postWithIframe(b, c) {
    var a = document.createElement("div");
    a.style.display = "none";
    a.innerHTML = "<iframe id='mainframe' name='mainframe' style='display:none;' > </iframe><form target='mainframe' data-ajax='false' id='frameform' action='' method='post' enctype='application/x-www-form-urlencoded'><input  value='' id='submitdata' name='submitdata' type='hidden'><input type='submit' value='提交' ></form>";
    document.body.appendChild(a);
    document.getElementById("submitdata").value = c;
    var d = document.getElementById("frameform");
    d.action = b + "&iframe=1";
    d.submit();
}

var havereturn = false;
var timeoutTimer = null;

function processError(c, b, a) {
    if (!havereturn) {
        havereturn = true;
        $(".ValError").html("提交超时，请检查网络是否异常！");
        $("#ctlNext").show();
    }
    if (timeoutTimer) {
        clearTimeout(timeoutTimer);
    }
}

var nvvv = 0;

function afterSubmit(u, l) {
    $(".ValError").html("");
    havereturn = true;
    debugLog("提交成功");
    var n = u.split("〒");
    var h = n[0];
    if (clientAnswerSend && h != 10 && h != 11) {
        try {
            saveSubmitAnswer(clientAnswerSend);
        } catch (q) {
        }
    }
    if (h == 10) {
        if (maxCheatTimes > 0) {
            var r = new Date();
            r.setTime(r.getTime() - (24 * 60 * 60 * 1000));
            setCookie(activityId + "_cheatTimes", 0, r.toUTCString(), "/", "", null);
        }
        var g = n[1];
        var o = g.replace("complete.aspx", "completemobile2.aspx").replace("?q=", "?activity=").replace("&joinid=", "&joinactivity=").replace("&JoinID=", "&joinactivity=");
        if (window.isDingDing) {
            o += "&dd_nav_bgcolor=FF5E97F6";
            if (window.ddcorpid) {
                o += "&ddpid=" + encodeURIComponent(ddcorpid);
            }
        }
        if (window.isYdb) {
            o += "&ydb=1";
        }
        if (window.isPvw) {
            o += "&pvw=1";
        }
        if (startAge) {
            o += "&sa=" + encodeURIComponent(startAge);
        }
        if (endAge) {
            o += "&ea=" + encodeURIComponent(endAge);
        }
        if (gender) {
            o += "&ge=" + gender;
        }
        if (marriage) {
            o += "&marr=" + marriage;
        }
        if (education) {
            o += "&educ=" + education;
        }
        if (jpmatch) {
            o += "&jpm=" + jpmatch;
        }
        if (rName) {
            o += "&rname=" + encodeURIComponent(rName.replace("(", "（").replace(")", "）"));
        }
        if (window.parterrealname) {
            o += "&parterrealname=" + encodeURIComponent(window.parterrealname) + "&rname=" + encodeURIComponent(window.parterrealname);
        }
        if (window.parterextf) {
            o += "&parterextf=" + encodeURIComponent(parterextf);
        }
        if (window.wxUserId) {
            if ($("#hrefGoBack2")[0]) {
                o += "&wxuserid=" + encodeURIComponent(window.wxUserId);
            }
        }
        if (inviteid) {
            o += "&inviteid=" + encodeURIComponent(inviteid);
        }
        if (window.sourceurl) {
            o += "&source=" + encodeURIComponent(sourceurl);
        }
        if (window.sjUser) {
            o += "&sjUser=" + encodeURIComponent(sjUser);
        }
        if (window.parterjoiner) {
            o += "&parterjoiner=" + encodeURIComponent(parterjoiner);
        }
        if (window.needHideShare) {
            o += "&nhs=1";
        }
        if (window.isSimple) {
            o += "&s=t";
        }
        if (window.sourcename) {
            o += "&souname=" + encodeURIComponent(sourcename);
        }
        if (window.user_token) {
            o += "&user_token=" + encodeURIComponent(window.user_token);
        }
        if (!window.wxthird && window.access_token && window.hashb) {
            o += "&access_token=" + encodeURIComponent(access_token) + "&openid=" + encodeURIComponent(openid);
        }
        if (window.isWeiXin) {
            var r = new Date();
            r.setTime(r.getTime() + (30 * 60 * 1000));
            setCookie("join_" + activityId, "1", r.toUTCString(), "/", "", null);
        }
        if ($("#shopcart")[0] && $("#shopcart")[0].style.display != "none") {
            o += "&ishop=1";
        }
        clearAnswer();
        location.replace(o);
        return;
    } else {
        if (h == 11) {
            var m = n[1];
            if (!m) {
                m = window.location.href;
            } else {
                if (m.toLowerCase().indexOf("http://") == -1 && m.toLowerCase().indexOf("https://") == -1) {
                    m = "http://" + m;
                }
            }
            m = m.replace("http://r.sojump.net.cn", "http://r.sojump.cn");
            var w = n[3] || "";
            var k = n[4] || "";
            var t = false;
            if (m.indexOf("{output}") > -1) {
                if (window.sojumpParm) {
                    m = m.replace("{output}", window.sojumpParm);
                } else {
                    if (k) {
                        m = m.replace("{output}", k);
                    }
                }
                t = true;
            }
            debugLog(m);
            if (window.sojumpParm || k) {
                var j = w.split(",");
                var a = "sojumpindex=" + j[0];
                if (m.indexOf("?") > -1) {
                    a = "&" + a;
                } else {
                    a = "?" + a;
                }
                if (j[1]) {
                    a += "&totalvalue=" + j[1];
                }
                if (m.toLowerCase().indexOf("sojumpparm=") == -1 && !t && window.sojumpParm) {
                    a += "&sojumpparm=" + window.sojumpParm;
                }
                if (m.toLowerCase().indexOf("pingzheng=") == -1 && !t && k) {
                    a += "&pingzheng=" + k;
                }
                m += a;
            }
            if (window.wxthird && window.openid) {
                if (m.indexOf("?") > -1) {
                    m += "&";
                } else {
                    m += "?";
                }
                m += "openid=" + encodeURIComponent(openid);
            }
            if (window.parterjoiner) {
                if (m.indexOf("?") > -1) {
                    m += "&";
                } else {
                    m += "?";
                }
                m += "parterjoiner=" + encodeURIComponent(parterjoiner);
            }
            if (m.indexOf("www.sojump.com") > -1) {
                m = m.replace("/jq/", "/m/");
            }
            var s = n[2];
            var f = 1000;
            if (s && window.jiFenBao == 0 && s != "不提示" && !window.sojumpParm) {
                $(".ValError").html(s);
                f = 2000;
            }
            debugLog(s);
            clearAnswer();
            setTimeout(function () {
                location.replace(m);
            }, f);
            debugLog("准备跳转");
            return;
        } else {
            if (l == 3) {
                if (h == 12) {
                    to_next_page();
                    $("#ctlNext").show();
                    return;
                } else {
                    if (h == 13) {
                        var d = n[1];
                        var v = n[2] || "0";
                        var g = "/wjx/join/completemobile2.aspx?activity=" + activityId + "&joinactivity=" + d;
                        g += "&v=" + v;
                        if (window.isWeiXin) {
                            setCookie("join_" + activityId, "1", null, "/", "", null);
                        }
                        if (window.sjUser) {
                            g += "&sjUser=" + encodeURIComponent(sjUser);
                        }
                        if (window.sourceurl) {
                            g += "&source=" + encodeURIComponent(sourceurl);
                        }
                        if (window.u) {
                            g += "&u=" + encodeURIComponent(window.u);
                        }
                        if (window.userSystem) {
                            g += "&userSystem=" + encodeURIComponent(window.userSystem);
                        }
                        if (window.systemId) {
                            g += "&systemId=" + encodeURIComponent(window.systemId);
                        }
                        clearAnswer();
                        location.replace(g);
                        return;
                    } else {
                        if (h == 11) {
                            return;
                        } else {
                            if (h == 5) {
                                alert(n[1]);
                                return;
                            } else {
                                if (n[2]) {
                                    alert(n[2]);
                                    $("#divNext").show();
                                    return;
                                }
                            }
                        }
                    }
                }
            } else {
                if (h == 9 || h == 16 || h == 23) {
                    var p = parseInt(n[1]);
                    var c = (p + 1) + "";
                    var e = n[2] || "您提交的数据有误，请检查！";
                    alert(e);
                    if (questionsObject[c]) {
                        writeError(questionsObject[c], e, 3000);
                        $(questionsObject[c])[0].scrollIntoView();
                    }
                    $("#ctlNext").show();
                } else {
                    if (h == 2 || h == 21) {
                        alert(n[1]);
                        window.submitWithGet = 1;
                        $("#ctlNext").show();
                    } else {
                        if (h == 4) {
                            alert(n[1]);
                            $("#ctlNext").show();
                            return;
                        } else {
                            if (h == 19 || h == 5) {
                                alert(n[1]);
                                $(".ValError").html(n[1]);
                                return;
                            } else {
                                if (h == 17 || h == 34) {
                                    alert("密码冲突！在您提交答卷之前，此密码已经被另外一个用户使用了，请更换密码重新填写问卷！");
                                    return;
                                } else {
                                    if (h == 22) {
                                        alert("提交有误，请输入验证码重新提交！");
                                        if (!needAvoidCrack) {
                                            tCode.style.display = "";
                                            imgCode.style.display = "";
                                            imgCode.onclick = refresh_validate;
                                            imgCode.onclick();
                                        }
                                        nvvv = 1;
                                        $("#ctlNext").show();
                                        return;
                                    } else {
                                        if (h == 7) {
                                            alert(n[1]);
                                            if (!needAvoidCrack) {
                                                tCode.style.display = "";
                                                if (!imgCode.onclick) {
                                                    imgCode.style.display = "";
                                                    imgCode.onclick = refresh_validate;
                                                }
                                                imgCode.onclick();
                                            } else {
                                                refresh_validate();
                                            }
                                            $("#ctlNext").show();
                                            return;
                                        } else {
                                            var b = n[1] || u;
                                            alert(b);
                                            $("#ctlNext").show();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    refresh_validate();
}

function clearFieldValue(c) {
    if (isLoadingAnswer) {
        return;
    }
    var d = $(c).attr("type");
    if (d == "3") {
        if ($(c).attr("qingjing") == "1") {
            return;
        }
        $("input[type='radio']:checked", $(c)).each(function () {
            this.checked = false;
            $(this).parent().parent().find("a.jqradio").removeClass("jqchecked");
        });
        $("input.OtherRadioText", $(c)).each(function () {
            if (this.value) {
                $(this).val("").blur();
            }
        });
    } else {
        if (d == "4") {
            $("input:checked", $(c)).each(function () {
                this.checked = false;
                $(this).parent().parent().find("a.jqcheck").removeClass("jqchecked");
            });
        } else {
            if (d == "6" || d == "5") {
                $("a.rate-off", $(c)).each(function () {
                    $(this).removeClass("rate-on");
                    var a = $(this).attr("mode");
                    if (a) {
                        $(this).removeClass("rate-on" + a);
                    } else {
                        $(this).removeClass("rate-ontxt");
                    }
                });
                if (d == "5") {
                    saveLikert(c);
                }
            } else {
                if (d == "7") {
                    if ($("select", $(c)).val() != "-2") {
                        $("select", $(c)).val("-2").trigger("change");
                    }
                } else {
                    if (d == "8") {
                        var e = $("input", $(c));
                        if (e.val()) {
                            e.val("").change();
                        }
                    } else {
                        if (d == "9") {
                            $("input.ui-slider-input", $(c)).each(function () {
                                if (this.value) {
                                    $(this).val("").change();
                                }
                            });
                        } else {
                            if (d == "11") {
                                $("li.ui-li-static", $(c)).each(function () {
                                    $(this).find("span.sortnum").html("").removeClass("sortnum-sel");
                                    $(this).attr("check", "");
                                });
                            }
                        }
                    }
                }
            }
        }
    }
}

function validateQ(o) {
    var g = $(o).attr("req"), k = $(o).attr("type"), n = true;
    var j = $(o)[0];
    var f = "";
    var e = $(o).attr("hasjump");
    if (k == "1") {
        var h = $("input", $(o));
        var d = $.trim(h.val());
        n = d.length == 0 ? false : true;
        if ($(h[0]).attr("verify") == "密码") {
            h[0].needCheckConfirm = true;
        }
        f = verifyTxt(o, h);
    } else {
        if (k == "21" && g == "1") {
            var m = 0;
            $(".shop-item .itemnum", o).each(function (a) {
                var b = $(this).val();
                if (b && b != "0") {
                    m++;
                }
            });
            if (m == 0) {
                n = false;
            }
        } else {
            if (k == "2") {
                var h = $("textarea", $(o));
                var d = $.trim(h.val());
                n = d.length == 0 ? false : true;
                f = verifyTxt(o, h);
            } else {
                if (k == "3") {
                    n = false;
                    $(o).find("input:checked").each(function () {
                        n = true;
                        if (this.getAttribute("jumpto") == -1) {
                            needSubmitNotValid = true;
                        }
                        var a = $(this).attr("rel");
                        if (a) {
                            var b = $("#" + a);
                            if (b.attr("required") && b.val().length == 0) {
                                f = "文本框内容必须填写！";
                                if (langVer == 1) {
                                    f = "Please enter a value.";
                                }
                                writeError(o, f, 3000);
                                return false;
                            }
                        }
                    });
                } else {
                    if (k == "4") {
                        n = false;
                        var p = false;
                        $(o).find("input:checked").each(function () {
                            n = true;
                            var a = $(this).attr("rel");
                            if (a) {
                                var b = $("#" + a);
                                if (b.attr("required") && b.val().length == 0) {
                                    f = "文本框内容必须填写！";
                                    if (langVer == 1) {
                                        f = "Please enter a value.";
                                    }
                                    b.focus();
                                    writeError(o, f, 3000);
                                    p = true;
                                    return false;
                                }
                            }
                        });
                        if (!p) {
                            f = verifyCheckMinMax($(o), true);
                        }
                    } else {
                        if (k == "11") {
                            n = $("li.ui-li-static[check='1']", $(o)).length == 0 ? false : true;
                            var p = false;
                            $("li.ui-li-static[check='1']", $(o)).each(function () {
                                n = true;
                                var a = $("input[type='hidden']", $(this)).eq(0).attr("id");
                                if (a) {
                                    var b = $("#tq" + a);
                                    if (b.attr("required") && b.val().length == 0) {
                                        f = "文本框内容必须填写！";
                                        if (langVer == 1) {
                                            f = "Please enter a value.";
                                        }
                                        b.focus();
                                        writeError(o, f, 3000);
                                        p = true;
                                        return false;
                                    }
                                }
                            });
                            if (!p) {
                                f = verifyCheckMinMax($(o), true, true);
                            }
                        } else {
                            if (k == "5") {
                                n = validateScaleRating($(o));
                            } else {
                                if (k == "6") {
                                    f = validateMatrix($(o), g);
                                    if (f) {
                                        writeError(o, f, 1000);
                                        return false;
                                    }
                                } else {
                                    if (k == "7") {
                                        var i = $("select", $(o))[0];
                                        n = i.selectedIndex == 0 ? false : true;
                                        if (n) {
                                            if (i.options[i.selectedIndex] && i.options[i.selectedIndex].getAttribute("jumpto") == -1) {
                                                needSubmitNotValid = true;
                                            }
                                        }
                                    } else {
                                        if (k == "8") {
                                            n = $("input", $(o)).val().length == 0 ? false : true;
                                        } else {
                                            if (k == "9") {
                                                $("input", $(o)).each(function () {
                                                    var a = $(this);
                                                    var c = $.trim(a.val());
                                                    if (window.hasReferClient) {
                                                        var b = this.parentNode.parentNode.parentNode;
                                                        if (b && b.style.display == "none") {
                                                            return true;
                                                        }
                                                    }
                                                    if (c.length == 0) {
                                                        n = false;
                                                        if (a.attr("isrequir") == "0") {
                                                            n = true;
                                                        } else {
                                                            return false;
                                                        }
                                                    }
                                                    f = verifyTxt(o, a, true);
                                                    if (f) {
                                                        return false;
                                                    }
                                                    f = checkOnly(o, a);
                                                    if (f) {
                                                        return false;
                                                    }
                                                });
                                            } else {
                                                if (k == "12") {
                                                    var l = $(o).attr("total");
                                                    var q = l;
                                                    $("input", $(o)).each(function () {
                                                        var a = $(this);
                                                        if (window.hasReferClient) {
                                                            var c = this.parentNode.parentNode.parentNode;
                                                            if (c && c.style.display == "none") {
                                                                return true;
                                                            }
                                                        }
                                                        var b = a.val();
                                                        if (b.length == 0) {
                                                            n = false;
                                                        }
                                                        if (b) {
                                                            q = q - b;
                                                        }
                                                    });
                                                    if (q != 0) {
                                                        writeError(o, "", 3000);
                                                        return false;
                                                    }
                                                } else {
                                                    if (k == "13") {
                                                        if (!$(o)[0].fileName) {
                                                            n = false;
                                                        }
                                                    } else {
                                                        if (k == "10") {
                                                            var s = "input";
                                                            if ($(o).attr("select") == "1") {
                                                                s = "select";
                                                            }
                                                            var r = true;
                                                            $("table", $(o)).each(function () {
                                                                var a = $(this);
                                                                if (window.hasReferClient) {
                                                                    var b = this.parentNode;
                                                                    if (b && b.style.display == "none") {
                                                                        return true;
                                                                    }
                                                                }
                                                                $(s, a).each(function () {
                                                                    var t = $(this);
                                                                    var u = t.val();
                                                                    var c = this.parentNode.parentNode;
                                                                    if (c && c.style.display != "none") {
                                                                        if (u.length == 0 || (s == "select" && u == "-2")) {
                                                                            if (g == "1") {
                                                                                n = false;
                                                                                o.errorControl = this;
                                                                                return false;
                                                                            }
                                                                        }
                                                                        f = verifyTxt(o, t, true);
                                                                        if (f) {
                                                                            o.errorControl = this;
                                                                            r = false;
                                                                            return false;
                                                                        }
                                                                    }
                                                                });
                                                                if (!r) {
                                                                    return false;
                                                                }
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (!n && g == "1") {
        f = "请回答此题";
        if (k == "1" || k == "2") {
            f = "请输入内容";
        } else {
            if (k == "3" || k == "4" || k == "7") {
                f = "请选择选项";
            } else {
                if (k == "13") {
                    f = "请上传文件";
                } else {
                    if (k == "21") {
                        f = "请选择";
                    }
                }
            }
        }
        if (k == "6" && $(o)[0].isMatrixFillError) {
            f = "请注明原因";
        }
        if (langVer == 1) {
            f = "required";
        }
        writeError(o, f, 1000);
    } else {
        $("span.error", $(o)).hide();
        $("div.field-label", $(o)).css("background", "");
    }
    if (f) {
        return false;
    }
    if (j.removeError) {
        j.removeError();
    }
    return true;
}

function show_prev_page() {
    if (cur_page > 0 && pageHolder[cur_page - 1].hasExceedTime) {
        alert("上一页填写超时，不能返回上一页");
        return;
    }
    var k = $("#divNext")[0];
    var b = $("#divPrev")[0];
    pageHolder[cur_page].style.display = "none";
    k.style.display = "";
    $("#divSubmit").hide();
    cur_page--;
    for (var h = cur_page; h >= 0; h--) {
        if (pageHolder[h].skipPage) {
            cur_page--;
        } else {
            break;
        }
    }
    var e = window.isKaoShi;
    for (var h = cur_page; h >= 0; h--) {
        var l = pageHolder[h].questions;
        var g = false;
        for (var f = 0; f < l.length; f++) {
            var a = l[f];
            if (a.style.display != "none") {
                g = true;
                break;
            }
        }
        var d = false;
        if (!g && pageHolder[h].childNodes && pageHolder[h].childNodes.length > 0) {
            var c = pageHolder[h].cuts;
            if (!c) {
                c = pageHolder[h].cuts = $(".cutfield", pageHolder[h]);
            }
            for (var f = 0; f < c.length; f++) {
                if (c[f].style.display != "none") {
                    d = true;
                    break;
                }
            }
        }
        if (!g && !d && cur_page > 0) {
            cur_page--;
        } else {
            break;
        }
    }
    if (cur_page == 0) {
        b.style.display = "none";
    }
    pageHolder[cur_page].style.display = "";
    pageHolder[cur_page].scrollIntoView();
    showProgress();
}

function show_next_page() {
    var a = $("#divNext a")[0];
    if (a && a.disabled && !isLoadingAnswer) {
        return;
    }
    if (!validate()) {
        return;
    }
    var b = $(pageHolder[cur_page]).attr("iszhenbie") == "true";
    if (needSubmitNotValid && window.isRunning) {
        $("#divNext").hide();
        groupAnswer(3);
    } else {
        if (b && window.isRunning) {
            $("#divNext").hide();
            groupAnswer(3);
        } else {
            to_next_page();
        }
    }
}

function to_next_page() {
    var m = $("#divNext")[0];
    var b = $("#divPrev")[0];
    b.style.display = displayPrevPage;
    pageHolder[cur_page].style.display = "none";
    cur_page++;
    if (cur_page == 1) {
        $("#divDesc").hide();
    }
    for (var k = cur_page; k < pageHolder.length; k++) {
        if (pageHolder[k].skipPage) {
            cur_page++;
        } else {
            break;
        }
    }
    var e = window.isKaoShi;
    for (var k = cur_page; k < pageHolder.length; k++) {
        var n = pageHolder[k].questions;
        var h = false;
        for (var f = 0; f < n.length; f++) {
            var a = n[f];
            if (a.style.display != "none") {
                h = true;
                break;
            }
        }
        var d = false;
        if (!h && pageHolder[k].childNodes && pageHolder[k].childNodes.length > 0) {
            var c = pageHolder[k].cuts;
            if (!c) {
                c = pageHolder[k].cuts = $(".cutfield", pageHolder[k]);
            }
            for (var f = 0; f < c.length; f++) {
                if (c[f].style.display != "none") {
                    d = true;
                    break;
                }
            }
        }
        if (!h && !d && cur_page < pageHolder.length - 1) {
            cur_page++;
        } else {
            break;
        }
    }
    var g = true;
    for (var k = cur_page + 1; k < pageHolder.length; k++) {
        if (!pageHolder[k].skipPage) {
            g = false;
        }
    }
    if (cur_page >= pageHolder.length - 1 || g) {
        m.style.display = "none";
        $("#divSubmit").show();
    }
    if (cur_page < pageHolder.length - 1) {
        m.style.display = "";
    }
    pageHolder[cur_page].style.display = "";
    initSlider();
    var l = document.getElementById("divMaxTime");
    if (l && l.style.display == "") {
        $("body,html").animate({scrollTop: 0}, 100);
    } else {
        pageHolder[cur_page].scrollIntoView();
    }
    showProgress();
    if (window.hasPageTime) {
        processMinMax();
    }
    fixBottom();
    $("#divMatrixHeader").hide();
}

function processSearch() {
    if (!document.referrer) {
        return;
    }
    var b = document.referrer;
    var a = false;
    if (b.indexOf("baidu.com") > -1 || b.indexOf("google.com") > -1 || b.indexOf("so.360.cn") > -1 || b.indexOf(".so.com") > -1 || b.indexOf(".sogou.com") > -1 || b.indexOf(".soso.com") > -1 || b.indexOf(".haoso.com") > -1 || b.indexOf(".sm.cn") > -1) {
        a = true;
    }
    if (a) {
        $("#divSearch").show().html('<a href="https://www.wjx.cn/mobile/publicsurveys.aspx" style="color:#66beff;">搜索更多相关问卷模板</a>');
    }
}

function initSlider() {
    if (window.hasSlider) {
        $(pageHolder[cur_page].questions).each(function () {
            var e = $(this);
            var d = e.attr("type");
            if (d == "8" || d == "12" || d == "9" || d == "10") {
                var c = getTopic(e);
                var a = document.getElementById("divRef" + c);
                var b = a && a.style.display == "";
                if (!b) {
                    setTimeout(function () {
                        var f = $("input.ui-slider-input:visible", e);
                        f.rangeslider({polyfill: false});
                    }, 10);
                }
            }
        });
    }
}

function initqSlider(d) {
    if (!window.hasSlider) {
        return;
    }
    var c = $(d);
    var b = c.attr("type");
    var a = b == "8" || b == "12" || b == "9" || b == "10";
    if (!a) {
        return;
    }
    initEleSlider(d);
}

function initEleSlider(a) {
    if (a.hasInitSlider) {
        return;
    }
    var b = $("input.ui-slider-input:visible", a);
    if (!b.rangeslider) {
        return;
    }
    b.rangeslider({polyfill: false});
    a.hasInitSlider = true;
}

function showProgress() {
    if (totalPage == 1) {
        return;
    }
    var c = cur_page + 1;
    if (c > totalPage) {
        c = totalPage;
    }
    var b = c + "/" + totalPage;
    $(".pagepercent").html(b + "页");
    var a = c * 100 / totalPage;
    $(".pagebar").width(a + "%");
}

function verifyCheckMinMax(a, c, j, e) {
    var d = a.attr("minvalue");
    var h = a.attr("maxvalue");
    var g = a[0];
    if (d == 0 && h == 0) {
        return "";
    }
    var f = 0;
    if (j) {
        f = $("li.ui-li-static[check='1']", a).length;
    } else {
        f = $("input:checked", a).length;
    }
    if (f == 0 && !a.attr("req")) {
        return;
    }
    var b = "";
    if (langVer == 0) {
        b = "&nbsp;&nbsp;&nbsp;您已经选择了" + f + "项";
    }
    var i = true;
    if (h > 0 && f > h) {
        if (e) {
            if (langVer == 0) {
                alert("此题最多只能选择" + h + "项");
            }
            if (a.attr("type") == 11 && $(e)[0].type == "text") {
                $(e).parent().parent().trigger("click");
            } else {
                $(e).trigger("click");
            }
            return "";
        }
        if (langVer == 0) {
            b += ",<span style='color:red;'>多选择了" + (f - h) + "项</span>";
        } else {
            b = validate_info + validate_info_check4 + h + type_check_limit5;
        }
        i = false;
    } else {
        if (d > 0 && f < d) {
            if (langVer == 0) {
                b += ",<span style='color:red;'>少选择了" + (d - f) + "项</span>";
            } else {
                b = validate_info + validate_info_check5 + d + type_check_limit5;
            }
            i = false;
            if (!j && f == 1 && $("input:checked", a).parents(".ui-checkbox").hasClass("huchi")) {
                i = true;
            }
        }
    }
    if (!g.errorMessage) {
        g.errorMessage = $(".errorMessage", a)[0];
    }
    if (!i) {
        if (!c) {
            g.errorMessage.innerHTML = b;
        } else {
            writeError(a[0], b, 3000);
        }
        return b;
    } else {
        g.errorMessage.innerHTML = "";
    }
    return "";
}

function checkOnly(e, h) {
    var j = $(h);
    var i = j[0];
    var l = j.attr("needonly");
    if (!l) {
        return "";
    }
    if (j.attr("verify") == "地图") {
        return "";
    }
    var g = j.val();
    if (!g) {
        return "";
    }
    if (g.length > 50) {
        return "";
    }
    var b = getTopic(e);
    var c = j.attr("rowid");
    if (c) {
        b = parseInt(b) * 10000 + parseInt(c);
    } else {
        var a = j.attr("gapindex");
        if (a) {
            b = parseInt(b) * 10000 + parseInt(a);
        }
    }
    var d = "/Handler/AnswerOnlyHandler.ashx?q=" + activityId + "&at=" + encodeURIComponent(g) + "&qI=" + b + "&o=true&t=" + (new Date()).valueOf();
    var k = $(e)[0];
    var f = "";
    if (!i.errorOnly) {
        i.errorOnly = new Object();
    }
    if (i.errorOnly[g]) {
        f = validate_only;
        if (k.verifycodeinput) {
            k.verifycodeinput.parentNode.style.display = "none";
        }
        if (!k.errorControl && b - 10000 > 0) {
            k.errorControl = i;
        }
        writeError(k, f, 3000);
        return f;
    }
    $.ajax({
        type: "GET", url: d, async: false, success: function (m) {
            if (m == "false1") {
                f = validate_only;
                i.errorOnly[g] = 1;
                if (k.verifycodeinput) {
                    k.verifycodeinput.parentNode.style.display = "none";
                }
                if (!k.errorControl && b - 10000 > 0) {
                    k.errorControl = i;
                }
                writeError(k, f, 3000);
                return f;
            }
            return "";
        }
    });
}

function verifyTxt(a, e, d) {
    var c = $(e).val();
    var h = $(e).attr("verify");
    var i = $(e).attr("minword");
    var f = $(e).attr("maxword");
    var g = $(a)[0];
    var b = "";
    if (!c) {
        return b;
    }
    if (g.removeError) {
        g.removeError();
    }
    b = verifyMinMax(c, h, i, f);
    if (!b) {
        b = verifydata(c, h, $(e)[0]);
    }
    if (b) {
        if (!g.errorControl && d) {
            g.errorControl = $(e)[0];
        }
        writeError(g, b, 3000);
        return b;
    }
    if (!b && g.needsms && !g.issmsvalid) {
        b = "提示：您的手机号码没有通过验证，请先验证";
        writeError(g, b, 3000);
    }
    return b;
}

function validateMatrix(s, h) {
    var j = $("table.matrix-rating", $(s)), t;
    var g = "";
    $(s)[0].isMatrixFillError = false;
    var k = j[0].rows;
    for (var o = 0; o < k.length; o++) {
        var b = k[o];
        var f = b.getAttribute("tp");
        if (f != "d") {
            continue;
        }
        if (window.hasReferClient && b.style.display == "none") {
            continue;
        }
        var p = $(b).attr("fid"), r = $("a.rate-on", $(b));
        t = "";
        if (r.length == 0) {
            $("#" + p, $(s)).val("");
            if (h == "1") {
                g = "请回答此题";
                if (langVer == 1) {
                    g = "required";
                }
                $(s)[0].errorControl = $(b).prev("tr")[0];
                break;
            } else {
                continue;
            }
        } else {
            t = $(r[r.length - 1]).attr("dval");
            var x = $(s).attr("ischeck");
            if (x) {
                t = "";
                var l = $(s).attr("minvalue");
                var n = $(s).attr("maxvalue");
                if (l && r.length - l < 0) {
                    g = validate_info + validate_info_check5 + l + type_check_limit5;
                    $(s)[0].errorControl = $(b).prev("tr")[0];
                    break;
                } else {
                    if (n && r.length - n > 0) {
                        g = validate_info + validate_info_check4 + n + type_check_limit5;
                        $(s)[0].errorControl = $(b).prev("tr")[0];
                        break;
                    }
                }
                var v = true;
                $(r).each(function () {
                    if (t) {
                        t += ";";
                    }
                    t += $(this).attr("dval");
                    var c = $(this).attr("needfill");
                    if (c) {
                        var d = this.fillvalue || "";
                        d = replace_specialChar(d).replace(/;/g, "；").replace(/,/g, "，");
                        t += spChars[2] + d;
                        var a = $(this).attr("req");
                        if (a && !d) {
                            g = "请回答此题";
                            if (langVer == 1) {
                                g = "required";
                            }
                            $(s)[0].isMatrixFillError = true;
                            showMatrixFill(this, 1);
                            v = false;
                            return false;
                        }
                    }
                });
                if (!v) {
                    break;
                }
            } else {
                var w = $(r[r.length - 1]).attr("mode");
                if (!w) {
                    var m = $(r[r.length - 1]).attr("needfill");
                    if (m) {
                        var q = r[r.length - 1].fillvalue || "";
                        q = replace_specialChar(q).replace(/;/g, "；").replace(/,/g, "，");
                        t += spChars[2] + q;
                        var u = $(r[r.length - 1]).attr("req");
                        if (u && !q) {
                            g = "请回答此题";
                            if (langVer == 1) {
                                g = "required";
                            }
                            $(s)[0].isMatrixFillError = true;
                            showMatrixFill(r[r.length - 1], 1);
                            break;
                        }
                    }
                }
            }
            $("#" + p, $(s)).attr("value", t);
        }
    }
    return g;
}

function validateScaleRating(d) {
    var e = true, f = $("table.scale-rating", $(d));
    var f = $("a.rate-on", f);
    if (f.length == 0) {
        e = false;
        $("input:hidden", $(d)).val("");
    } else {
        $("input:hidden", $(d)).attr("value", $(f[f.length - 1]).attr("val"));
        if (f.attr("jumpto") == -1) {
            needSubmitNotValid = true;
        }
    }
    return e;
}

function jump(c, e) {
    var d = $(c);
    var f = d.attr("hasjump");
    if (f) {
        var b = d.attr("type");
        var a = d.attr("anyjump");
        if (a > 0) {
            jumpAnyChoice(c);
        } else {
            if (a == 0 && b != "3" && b != "5" && b != "7") {
                jumpAnyChoice(c);
            } else {
                jumpByChoice(c, e);
            }
        }
    }
}

function jumpAnyChoice(c, f) {
    var d = $(c);
    var b = d.attr("type");
    var a = false;
    if (b == "1") {
        a = $("input", d).val().length > 0;
    } else {
        if (b == "2") {
            a = $("textarea", d).val().length > 0;
        } else {
            if (b == "3") {
                a = $("input[type='radio']:checked", d).length > 0;
            } else {
                if (b == "4") {
                    a = $("input[type='checkbox']:checked", d).length > 0;
                } else {
                    if (b == "5") {
                        a = $("a.rate-on", d).length > 0;
                    } else {
                        if (b == "6") {
                            a = $("a.rate-on", d).length > 0;
                        } else {
                            if (b == "7") {
                                a = $("select", d).val() != -2;
                            } else {
                                if (b == "8") {
                                    a = $("input", d).val().length > 0;
                                } else {
                                    if (b == "9" || b == "12") {
                                        $("input", d).each(function () {
                                            var g = $(this).val();
                                            if (g.length > 0) {
                                                a = true;
                                            }
                                        });
                                    } else {
                                        if (b == "10") {
                                            var e = d.attr("select") == "1";
                                            if (e) {
                                                $("select", d).each(function () {
                                                    var g = $(this).val();
                                                    if (g != -2) {
                                                        a = true;
                                                    }
                                                });
                                            } else {
                                                $("input", d).each(function () {
                                                    var g = $(this).val();
                                                    if (g.length > 0) {
                                                        a = true;
                                                    }
                                                });
                                            }
                                        } else {
                                            if (b == "11") {
                                                a = $("li[check='1']", d).length > 0;
                                            } else {
                                                if (b == "13") {
                                                    a = d[0].fileName ? true : false;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    jumpAny(a, c, f);
}

function jumpByChoice(e, f) {
    var d = $(e).attr("type");
    var c = $(e)[0];
    if (f.value == "-2") {
        processJ(c.indexInPage - 0, 0);
    } else {
        if (f.value == "-1" || f.value == "") {
            processJ(c.indexInPage - 0, 0);
        } else {
            if ((d == "3" || d == "5" || d == "7")) {
                var g = f.value || $(f).attr("val");
                if (parseInt(g) == g) {
                    var b = $(f).attr("jumpto");
                    if (!b) {
                        b = 0;
                    }
                    var a = b - 0;
                    processJ(c.indexInPage - 0, a);
                }
            }
        }
    }
}

function jumpAny(c, e, g) {
    var f = $(e);
    var d = f.attr("type");
    var h = f.attr("hasjump");
    var a = f.attr("anyjump") - 0;
    var b = f[0];
    if (h) {
        if (c) {
            processJ(b.indexInPage - 0, a, g);
        } else {
            processJ(b.indexInPage - 0, 0, g);
        }
    }
}

function processJ(p, d, e) {
    var a = p + 1;
    var b = cur_page;
    var f = d == 1 || d == -1;
    for (var k = cur_page; k < pageHolder.length; k++) {
        var m = pageHolder[k].questions;
        if (f) {
            b = k;
        }
        for (var h = a; h < m.length; h++) {
            var l = getTopic(m[h]);
            if (l == d || f) {
                b = k;
            }
            if ($(m[h]).attr("nhide") == "1") {
                continue;
            }
            if (l < d || f) {
                m[h].style.display = "none";
            } else {
                if (relationNotDisplayQ[l]) {
                    var g = 1;
                } else {
                    m[h].style.display = "";
                }
                var c = $(m[h]).attr("hasjump");
                if (c && !e) {
                    clearFieldValue(m[h]);
                }
            }
        }
        if (!pageHolder[k].cuts) {
            pageHolder[k].cuts = $(".cutfield", pageHolder[k]);
        }
        for (var h = 0; h < pageHolder[k].cuts.length; h++) {
            var o = pageHolder[k].cuts[h];
            var l = o.getAttribute("qtopic");
            if (!l) {
                continue;
            }
            if (l <= a) {
                continue;
            }
            if (l < d || f) {
                o.style.display = "none";
            } else {
                var n = o.getAttribute("topic");
                if (relationNotDisplayQ[n]) {
                    var g = 1;
                } else {
                    o.style.display = "";
                }
            }
        }
        a = 0;
    }
    fixBottom();
}

function GetBacktoServer() {
    str = window.location.pathname;
    index = str.lastIndexOf("/");
    page = str.substr(index + 1, str.length - index);
    data = readCookie("history");
    if (data != null && data.toLowerCase() != page.toLowerCase()) {
        window.location.href = window.location.href;
    }
}

function readCookie(h) {
    for (var j = h + "=", i = document.cookie.split(";"), f = 0; f < i.length; f++) {
        var g = i[f];
        while (g.charAt(0) == " ") {
            g = g.substring(1, g.length);
        }
        if (g.indexOf(j) == 0) {
            return g.substring(j.length, g.length);
        }
    }
    return null;
}

function removeError() {
    if (this.errorMessage) {
        this.errorMessage.innerHTML = "";
        this.removeError = null;
        this.style.border = "solid 2px #f7f7f7";
        if (this.errorControl) {
            this.errorControl.style.background = "white";
            this.errorControl = null;
        }
    }
}

function writeError(a, c, b) {
    a = $(a)[0];
    a.style.border = "solid 2px #ff9900";
    if (a.errorMessage) {
        a.errorMessage.innerHTML = c;
    } else {
        a.errorMessage = $(".errorMessage", $(a))[0];
        a.errorMessage.innerHTML = c;
    }
    a.removeError = removeError;
    if (a.errorControl) {
        a.errorControl.style.background = "#FBD5B5";
    }
    if (!firstError) {
        firstError = a;
    }
    return false;
}

function verifydata(d, c, e) {
    if (!c) {
        return "";
    }
    var a = null;
    if (c.toLowerCase() == "email" || c.toLowerCase() == "msn") {
        a = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
        if (!a.exec(d)) {
            return validate_email;
        } else {
            return "";
        }
    } else {
        if (c == "日期" || c == "生日" || c == "入学时间") {
            return "";
        } else {
            if (c == "固话") {
                a = /^((\d{4}-\d{7})|(\d{3,4}-\d{8}))(-\d{1,4})?$/;
                if (!a.exec(d)) {
                    return validate_phone.replace("，请注意使用英文字符格式", "");
                } else {
                    return "";
                }
            } else {
                if (c == "手机") {
                    a = /^\d{11}$/;
                    if (!a.exec(d)) {
                        return validate_mobile.replace("，请注意使用英文字符格式", "");
                    } else {
                        return "";
                    }
                } else {
                    if (c == "密码") {
                        return checkPassword(d, e);
                    } else {
                        if (c == "确认密码") {
                            if (e && e.firstPwd) {
                                if (e.firstPwd.value != d) {
                                    return "两次密码输入不一致！";
                                }
                            }
                        } else {
                            if (c == "电话") {
                                a = /(^\d{11}$)|(^((\d{4}-\d{7})|(\d{3,4}-\d{8}))(-\d{1,4})?$)/;
                                if (!a.exec(d)) {
                                    return validate_mo_phone.replace("，请注意使用英文字符格式", "");
                                } else {
                                    return "";
                                }
                            } else {
                                if (c == "汉字") {
                                    a = /^[\u4e00-\u9fa5]+$/;
                                    if (!a.exec(d)) {
                                        return validate_chinese;
                                    } else {
                                        return "";
                                    }
                                } else {
                                    if (c == "姓名") {
                                        a = /^[\u4e00-\u9fa5]{2,4}$/;
                                        if (!a.exec(d)) {
                                            return "姓名必须为2到4个汉字";
                                        } else {
                                            return "";
                                        }
                                    } else {
                                        if (c == "英文") {
                                            a = /^[A-Za-z]+$/;
                                            if (!a.exec(d)) {
                                                return validate_english;
                                            } else {
                                                return "";
                                            }
                                        } else {
                                            if (c == "网址" || c == "公司网址") {
                                                a = /^https?:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
                                                if (!a.exec(d)) {
                                                    return validate_reticulation;
                                                } else {
                                                    return "";
                                                }
                                            } else {
                                                if (c == "身份证号") {
                                                    a = /^\d{15}(\d{2}[A-Za-z0-9])?$/;
                                                    if (!a.exec(d)) {
                                                        return validate_idcardNum;
                                                    } else {
                                                        return "";
                                                    }
                                                } else {
                                                    if (c == "学号") {
                                                        a = /^\d+$/;
                                                        if (!a.exec(d)) {
                                                            return validate_num.replace("，请注意使用英文字符格式", "");
                                                        }
                                                    } else {
                                                        if (c == "数字") {
                                                            a = /^(\-)?\d+$/;
                                                            if (!a.exec(d)) {
                                                                return validate_num.replace("，请注意使用英文字符格式", "");
                                                            }
                                                        } else {
                                                            if (c == "小数") {
                                                                a = /^(\-)?\d+(\.\d+)?$/;
                                                                if (!a.exec(d)) {
                                                                    return validate_decnum;
                                                                }
                                                            } else {
                                                                if (c.toLowerCase() == "qq") {
                                                                    a = /^\d+$/;
                                                                    var b = /^\w+([-+.]\w+)*@\w+([-.]\\w+)*\.\w+([-.]\w+)*$/;
                                                                    if (!a.exec(d) && !b.exec(d)) {
                                                                        return validate_qq;
                                                                    } else {
                                                                        return "";
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return "";
}

function checkPassword(f, d) {
    var c = /([a-zA-Z0-9!@#$%^&*()_?<>{}]){8,20}/;
    var b = /[a-zA-Z]+/;
    var a = /[0-9]+/;
    if (d && d.confirmPwd && d.needCheckConfirm) {
        var e = d.confirmPwd.value;
        if (e != f) {
            return "两次密码输入不一致！";
        }
    }
    if (c.test(f) && b.test(f) && a.test(f)) {
        return "";
    } else {
        if (!c.test(f)) {
            return "密码长度在8-20位";
        } else {
            if (!b.test(f)) {
                return "密码中必须包含字母";
            } else {
                if (!a.test(f)) {
                    return "密码中必须包含数字";
                }
            }
        }
    }
    return "";
}

function verifyMinMax(e, d, c, a) {
    if (d == "数字" || d == "小数") {
        var b = /^(\-)?\d+$/;
        if (d == "小数") {
            b = /^(\-)?\d+(\.\d+)?$/;
        }
        if (!b.exec(e)) {
            if (d == "小数") {
                return validate_decnum;
            } else {
                return validate_num.replace("，请注意使用英文字符格式", "");
            }
        }
        if (e != 0) {
            e = e.replace(/^0+/, "");
        }
        if (c != "") {
            if (d == "数字" && parseInt(e) - parseInt(c) < 0) {
                return validate_num2 + c;
            } else {
                if (d == "小数" && parseFloat(e) - parseFloat(c) < 0) {
                    return validate_num2 + c;
                }
            }
        }
        if (a != "") {
            if (d == "数字" && parseInt(e) - parseInt(a) > 0) {
                return validate_num1 + a;
            } else {
                if (d == "小数" && parseFloat(e) - parseFloat(a) > 0) {
                    return validate_num1 + a;
                }
            }
        }
    } else {
        if (a != "" && e.length - a > 0) {
            return validate_info_wd3.format(a, e.length);
        }
        if (c != "" && e.length - c < 0) {
            return validate_info_wd4.format(c, e.length);
        }
    }
    return "";
}

function getTopic(a) {
    return $(a).attr("topic");
}

function relationJoin(b) {
    if (b.style.display != "none") {
        var c = $(b);
        var a = c.attr("type");
        if (a == "3") {
            if ($("input:checked", c).length > 0) {
                displayRelationByType(c, "input[type=radio]", 1);
            }
        } else {
            if (a == "4") {
                if ($("input:checked", c).length > 0) {
                    displayRelationByType(c, "input[type=checkbox]", 2);
                }
            } else {
                if (a == "7") {
                    if ($("select", c)[0].selectedIndex > 0) {
                        displayRelationByType(c, "option", 5);
                    }
                }
            }
        }
    }
}

function displayRelationByType(e, d, c) {
    var b = getTopic(e);
    if (!relationQs[b]) {
        return;
    }
    e.hasDisplayByRelation = new Object();
    var a = -1;
    if (c == 4) {
        var f = $("a.rate-on", e);
        if (f[0] && $(f[0]).attr("mode")) {
            a = f.length - 1;
        }
    }
    $(d, e).each(function (h) {
        var j = false;
        var l = "";
        if (c == 1 || c == 2 || c == 5) {
            l = this.value;
        } else {
            if (c == 3) {
                l = $("input[type=hidden]", this).val();
            } else {
                if (c == 4) {
                    l = $(this).attr("val");
                }
            }
        }
        var m = b + "," + l;
        if (c == 3 && $(this).attr("check")) {
            j = true;
        } else {
            if (c == 4) {
                if (a == -1 && $(this).hasClass("rate-on")) {
                    j = true;
                } else {
                    if (h == a) {
                        j = true;
                    }
                }
            } else {
                if ((c == 1 || c == 2) && this.checked) {
                    j = true;
                } else {
                    if (c == 5 && this.selected) {
                        j = true;
                    }
                }
            }
        }
        displayByRelation(e, m, j);
        var g = b + ",-" + l;
        if (relationGroup.indexOf(b) != -1) {
            var k = relationGroupHT[g] || relationGroupHT[g.replace(",", ",-")];
            displayByRelation(e, g, j, true);
        }
        if (relationHT[g]) {
            displayByRelationNotSelect(e, g, j);
        }
    });
    fixBottom();
}

function displayByRelation(o, F, u, B) {
    var v = getTopic(o);
    if (relationGroup.indexOf(v) != -1) {
        var s = relationGroupHT[F] || relationGroupHT[F.replace(",", ",-")];
        if (s) {
            for (var w in s) {
                var m = new Object();
                var a = getTopic(s[w]);
                for (var g in relationGroupHT) {
                    for (var n in relationGroupHT[g]) {
                        if (a == getTopic(relationGroupHT[g][n])) {
                            var y = g.split(",")[0];
                            if (!m[y]) {
                                m[y] = new Array();
                            }
                            m[y].push("q" + g.replace(",", "_"));
                        }
                    }
                }
                var A = true;
                for (var d in m) {
                    var p = false;
                    for (var n = 0; n < m[d].length; n++) {
                        var C = m[d][n].replace("-", "");
                        var j = m[d][n].replace("q", "").split("_");
                        var l = document.getElementById(C);
                        var t = false;
                        var f = document.getElementById("div" + j[0]);
                        var r = $(f).attr("type");
                        if (j[1] < 0) {
                            if (r == "11") {
                                t = $(f).find("li[check='1']").length > 0;
                            } else {
                                t = $(f).find("input:checked").length > 0;
                            }
                        }
                        var b = document.getElementById("q" + j[0]);
                        if (l) {
                            if (r == "11" && j[1] > 0 == l.parentNode.getAttribute("check") == "1") {
                                p = true;
                            } else {
                                if (r != "11" && j[1] > 0 == l.checked) {
                                    p = true;
                                }
                            }
                        }
                        if (p) {
                            if (j[1] < 0 && !t) {
                                p = false;
                            } else {
                                break;
                            }
                        } else {
                            if (!l && r == 5) {
                                var z = $("a.rate-on", f);
                                var E = "";
                                if (z.length > 0) {
                                    E = $(z[z.length - 1]).attr("val");
                                }
                                if (j[1] == E) {
                                    p = true;
                                    break;
                                }
                            } else {
                                if (!l && b && j[1] == b.value) {
                                    p = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (!p) {
                        A = false;
                        break;
                    }
                }
                var h = questionsObject[a];
                if (h) {
                    h[0].style.display = A ? "" : "none";
                    if (!A) {
                        loopHideRelation(h);
                    } else {
                        initqSlider(h[0]);
                    }
                } else {
                    var D = document.getElementById("divCut" + (a.replace("c", "")));
                    if (D) {
                        D.style.display = A ? "" : "none";
                    }
                }
            }
        }
    }
    var q = relationHT[F];
    if (!q) {
        return;
    }
    for (var x = 0; x < q.length; x++) {
        var e = getTopic(q[x]);
        if (o.hasDisplayByRelation[e]) {
            continue;
        }
        if (!u && q[x].style.display != "none") {
            loopHideRelation(q[x]);
        } else {
            if (u) {
                q[x].style.display = "";
                if (q[x].getAttribute("isshop") == "1") {
                    updateCart(q[x]);
                }
                initqSlider(q[x]);
                if (!B) {
                    o.hasDisplayByRelation[e] = "1";
                }
                if (relationNotDisplayQ[e]) {
                    relationNotDisplayQ[e] = "";
                }
            }
        }
    }
}

function displayByRelationNotSelect(c, f, b) {
    var d = relationHT[f];
    if (!d) {
        return;
    }
    for (var a = 0; a < d.length; a++) {
        var e = getTopic(d[a]);
        if (c.hasDisplayByRelation[e]) {
            continue;
        }
        if (b && d[a].style.display != "none") {
            loopHideRelation(d[a]);
        } else {
            if (!b) {
                d[a].style.display = "";
                initqSlider(d[a]);
                c.hasDisplayByRelation[e] = "1";
                if (relationNotDisplayQ[e]) {
                    relationNotDisplayQ[e] = "";
                }
            }
        }
    }
}

function loopHideRelation(a) {
    var c = getTopic(a);
    var b = relationQs[c];
    if (b) {
        for (var e = 0; e < b.length; e++) {
            loopHideRelation(b[e], false);
        }
    }
    clearFieldValue(a);
    var d = $(a)[0];
    if (d) {
        d.style.display = "none";
        if (d.getAttribute("isshop") == "1") {
            updateCart(d);
        }
    }
    if (relationNotDisplayQ[c] == "") {
        relationNotDisplayQ[c] = "1";
    }
}

function checkHuChi(c, e) {
    var b = $(".huchi", c)[0];
    if (!b) {
        return;
    }
    var f = $(e);
    if (!$("input:checked", f)[0]) {
        return;
    }
    var a = $(".ui-checkbox", c);
    var d = f.hasClass("huchi");
    a.each(function () {
        if (this == e) {
            return true;
        }
        var g = $(this);
        if (!$("input:checked", g)[0]) {
            return true;
        }
        if (d) {
            g.trigger("click");
        } else {
            var h = g.hasClass("huchi");
            if (h) {
                g.trigger("click");
            }
        }
    });
}

function autoSubmit(c) {
    if (hasSurveyTime) {
        while (cur_page < totalPage - 1) {
            pageHolder[cur_page].hasExceedTime = true;
            show_next_page();
        }
    }
    divMaxTime.style.display = "none";
    $("body").css("padding-top", "0px");
    pageHolder[cur_page].hasExceedTime = true;
    var b = $("#divNext a")[0];
    if (b) {
        b.disabled = false;
    }
    if (cur_page < totalPage - 1) {
        show_next_page();
    } else {
        pageHolder[cur_page].style.display = "none";
        if (b && b.initVal) {
            b.innerHTML = b.initVal;
        }
        if (hasSurveyTime && tCode.style.display == "none" && window.hasAnswer && !c) {
            groupAnswer(1);
        } else {
            var a = "提示：您的作答时间已经超过最长时间限制，请直接提交答卷！";
            if (langVer == 1) {
                a = "Time is up,please submit!";
            }
            if (c) {
                a = c;
            }
            $(".ValError").html(a);
        }
    }
}

$(function () {
    function g() {
        document.oncontextmenu = document.ondragstart = document.onselectstart = function () {
            return false;
        };
        var k = document.getElementsByTagName("input");
        var m = document.getElementsByTagName("textarea");
        for (var l = 0; l < k.length; l++) {
            k[l].onpaste = function () {
                return false;
            };
        }
        for (var l = 0; l < m.length; l++) {
            m[l].onpaste = function () {
                return false;
            };
        }
    }

    function e() {
        if (!window.localStorage) {
            return;
        }
        localStorage.setItem("wjxlastanswer" + activityId, new Date().getTime());
    }

    function d() {
        hasSurveyTime = true;
        hasMaxtime = true;
        var k = document.getElementById("yz_popdivData");
        if (k && k.style.display != "none") {
            $("#yz_popTanChuClose").click();
        }
        autoSubmit("由于您超过" + maxOpTime + "秒没有任何操作，系统为防止作弊不允许再作答！");
    }

    if (window.isKaoShi) {
        g();
        if (window.maxOpTime) {
            var c = false;
            if (window.localStorage) {
                var b = localStorage["wjxlastanswer" + activityId];
                if (b) {
                    var j = new Date().getTime();
                    var f = (j - b) / (60 * 1000);
                    if (f < 10) {
                        c = true;
                        d();
                        $("#divSubmit").hide();
                    }
                }
            }
            if (!c) {
                document.onclick = document.onkeyup = document.onmousemove = document.onscroll = function (k) {
                    h = new Date();
                };
                var a = null;
                var h = new Date();
                var i = setInterval(function () {
                    var m = new Date();
                    var k = parseInt((m - h) / 1000);
                    var l = maxOpTime + 5 - k;
                    var n = document.getElementById("divTimeUp");
                    if (l <= 0) {
                        clearInterval(i);
                        e();
                        d();
                    } else {
                        if (l <= 5 && n) {
                            if (n.style.display == "none") {
                                openDialogByIframe(350, 60, "divTimeUp");
                            }
                            document.getElementById("divTimeUpTip").innerHTML = "<span style='color:red;'>" + l + "</span>秒后无操作，将不允许再作答！";
                        }
                    }
                }, 1000);
            }
        }
    }
});