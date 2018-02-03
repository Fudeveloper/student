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

def index(request):
    return render(request, 'quantization/index.html')


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
            save_path = os.path.join( img_type, student_id + "_{}.jpg".format(img_type))
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


@csrf_exempt
def check_city(request):
    post = request.POST
    send_city = post.get("city")
    print(send_city)
    return HttpResponse(check_poor_city.check_poor_city(send_city))


def auth(request):
    # 防跨站伪造参数
    state = "lalallsa"
    # 授权地址
    auth_url = "http://192.168.76.129:8000/quantization/auth/"
    # 回调地址
    callback_url = "http://192.168.76.129:8000/quantization/callback/"
    YIBAN_URL = "https://openapi.yiban.cn/"

    API_OAUTH_CODE = "oauth/authorize"

    API_OAUTH_TOKEN = "oauth/access_token"

    API_TOKEN_QUERY = "oauth/token_info"

    API_TOKEN_REVOKE = "oauth/revoke_token"

    app_key = "75695fe36534c768"
    app_secret = "58670b849a89c5ad6e2bc97a23690e94"
    url = "{0}{1}?client_id={2}&redirect_uri={3}&state={4}&display=mobile".format(YIBAN_URL, API_OAUTH_CODE, app_key,
                                                                                  callback_url,
                                                                                  state)
    return redirect(url)


def callback(request):
    callback_url = "http://192.168.76.129:8000/quantization/callback/"

    app_key = "75695fe36534c768"
    app_secret = "58670b849a89c5ad6e2bc97a23690e94"
    data = request.GET
    state = data.get("state")
    code = data.get("code")
    post_data = {"client_id": app_key, "client_secret": app_secret, "code": code,
                 "redirect_uri": callback_url}
    res = requests.post("https://openapi.yiban.cn/oauth/access_token", data=post_data)
    print(res.text)
    json_data = json.loads(res.text)
    if "access_token" in json_data.keys():
        access_token = json_data['access_token']
    elif "msgCN" in json_data.keys():
        return HttpResponse(json_data["msgCN"])
    else:
        return HttpResponse("授权失败，请重试")
    print(access_token)
    json_access = {"access_token": access_token}
    # 查询校方认证信息
    auth_res = requests.get("https://openapi.yiban.cn/user/verify_me", params=json_access)
    json_auth_res = json.loads(auth_res.text)
    if "status" in json_auth_res:
        if json_auth_res["status"] == "success":
            infos = json_auth_res["info"]
            # 真实姓名
            real_name = infos["yb_realname"]
            # 学号
            yb_studentid = infos["yb_studentid"]
            # 系别
            yb_collegename = infos["yb_collegename"]
            context = {"real_name": real_name, "yb_studentid": yb_studentid, "yb_collegename": yb_collegename}
            return render(request, 'quantization/index.html', context=context)
        else:
            return HttpResponse("授权错误")
    elif "msgCN" in json_data.keys():
        return HttpResponse(json_data["msgCN"])
    else:
        return HttpResponse("授权失败，请重试")
