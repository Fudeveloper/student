from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, FileResponse, StreamingHttpResponse
from .models import StudentInfo, StudentAnswer
from django.views.decorators.csrf import csrf_exempt
import logging
import os
import json
from decorate import *
from django.conf import settings
import check_poor_city
import requests

logger = logging.getLogger('student.views')


# Create your views here.
@auth_yb
def index(request):
    real_name = request.session["real_name"]
    yb_studentid = request.session["yb_studentid"]
    yb_collegename = request.session["yb_collegename"]

    context = {"real_name": real_name, "yb_studentid": yb_studentid, "yb_collegename": yb_collegename}
    return render(request, 'quantization/index.html', context)


@csrf_exempt
def index_handler(request):
    result = "ok"
    if request.method == 'POST':
        print("-----------------------------------")
        data = request.POST.dict()

        if data:
            print("-------------------123")
            print(data)
            if "studentId" in data.keys():
                studentId = data['studentId']
                exist_student = StudentInfo.objects.filter(studentId=studentId)
                if exist_student:
                    data.__delitem__("studentId")
                    print(data)
                    exist_student.update(**data)
                else:
                    StudentInfo.objects.create(**data)
            else:
                result = "error"
                # except Exception as e:
                #     logger.error(e)
                #     result = "error"
        else:
            result = "error"
    return JsonResponse({"result": result})


@auth_quantization
def main(request):
    return render(request, 'quantization/main.html')


@csrf_exempt
def main_handler(request):
    result = "ok"
    if request.method == 'POST':
        print("-----------------------------------")
        data = request.POST.dict()

        if data:
            print("-------------------123")
            print(data)
            if "studentId" in data.keys():
                studentId = data['studentId']
                exist_student = StudentAnswer.objects.filter(pk=studentId)
                print(exist_student)
                if exist_student:
                    data.__delitem__("studentId")
                    # print(data)
                    try:
                        exist_student.update(**data)
                    except Exception as e:
                        logger.error(e)
                else:
                    student_answer = {
                        "studentId": StudentInfo.objects.get(studentId=studentId),
                    }
                    StudentAnswer.objects.create(**student_answer)
                    StudentAnswer.objects.update(**data)
            else:
                print("---------------无studentid")
                result = "error"
        else:
            result = "error"
    return JsonResponse({"result": result})


def city(request):
    return render(request, 'quantization/city.html')


@csrf_exempt
def uploadimg(request, img_type):
    print(img_type)
    if img_type not in ["baseDatum", "fatherDatum", "motherDatum", "medicalDatum", "disasterDatum", "eventDatum"]:
        return HttpResponse("非法操作")
    print("COOKIES{}".format(request.COOKIES))
    # print("student_id:{}".format(student_id))
    error = ""
    if request.method == 'POST':
        # 如果检测到上传的文件
        if 'studentdatum' in request.FILES:
            # 检测用户是否通过index页面进入
            student_id = request.COOKIES.get('studentId')
            if not student_id:
                print(student_id)
                return HttpResponse("非法操作")
            # 保存上传的图片
            dir_path = os.path.join(settings.MEDIA_ROOT, img_type)

            print("-------------------------------------------------------------")
            print(dir_path)
            if not os.path.exists(dir_path):
                print("路径不存在")
                os.mkdir(dir_path)
            img = request.FILES.get('studentdatum')
            img_path = os.path.join(settings.MEDIA_ROOT, img_type, student_id + "_{}.jpg".format(img_type))
            save_path = os.path.join(img_type, student_id + "_{}.jpg".format(img_type))
            if os.path.exists(img_path):
                os.remove(img_path)
            with open(img_path, "wb+") as destination:
                for chunk in img.chunks():
                    destination.write(chunk)
            # 创建新的学生对象，或是往已存在的学生对象中录入信息
            current_student_answer = StudentAnswer.objects.filter(studentId_id=student_id)
            if not current_student_answer:
                student_answer = {
                    "studentId": StudentInfo.objects.get(studentId=student_id),
                    img_type: save_path
                }
                StudentAnswer.objects.create(**student_answer)
            else:
                update_dic = {img_type: save_path}
                current_student_answer.update(**update_dic)
            error = "success"
        else:
            error = "nofile"

    context = {"error": error}
    return render(request, 'uploadimg.html', context)


# 根据传入的城市计分
@csrf_exempt
def check_city(request):
    post = request.POST
    send_city = post.get("city")
    print(send_city)
    return HttpResponse(check_poor_city.check_poor_city(send_city))


def one(request):
    data = request.GET
    yb_uid = data.get("yb_uid")
    # print(yb_uid)
    state = data.get("state")
    code = data.get("code")
    post_data = {"client_id": settings.APP_KEY, "yb_uid":yb_uid}
    res = requests.post("https://openapi.yiban.cn/oauth/token_info", data=post_data)
    print(res)
    json_data = json.loads(res.text)
    print(json_data)
    if "access_token" in json_data.keys():
        access_token = json_data['access_token']
    elif "msgCN" in json_data.keys():
        return HttpResponse(json_data["msgCN"])
    else:
        url = "{0}{1}?client_id={2}&redirect_uri={3}&state={4}&display=mobile".format(settings.YIBAN_URL,
                                                                                  settings.API_OAUTH_CODE,
                                                                                  settings.APP_KEY,
                                                                                  settings.CALLBACK_URL,
                                                                                  settings.STATE)
        return redirect(url)

    json_access = {"access_token": access_token}
    # 查询校方认证信息

    auth_res = requests.get("https://openapi.yiban.cn/user/verify_me", params=json_access)
    json_auth_res = json.loads(auth_res.text)
    print(json_auth_res)
    if "status" in json_auth_res:
        if json_auth_res["status"] == "success":
            infos = json_auth_res["info"]
            # 真实姓名
            real_name = infos["yb_realname"]
            # 学号
            yb_studentid = infos["yb_studentid"]
            # 系别
            yb_collegename = infos["yb_collegename"]
            request.session["real_name"] = real_name
            request.session["yb_studentid"] = yb_studentid
            request.session["yb_collegename"] = yb_collegename

            return render(request, 'quantization/one.html')
        else:
            return HttpResponse("授权错误")
    elif "msgCN" in json_data.keys():
        return HttpResponse(json_data["msgCN"])
    else:
        url = "{0}{1}?client_id={2}&redirect_uri={3}&state={4}&display=mobile".format(settings.YIBAN_URL,
                                                                                  settings.API_OAUTH_CODE,
                                                                                  settings.APP_KEY,
                                                                                  settings.CALLBACK_URL,
                                                                                  settings.STATE)
        return redirect(url)
