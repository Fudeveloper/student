from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import base64
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import os

from democratic.models import FillStudentInfo
from quantization import models
from decorate import *
from quantization.models import StudentInfo


def index(request):
    context = {"title": "请填写被评测人学号", "for": "input_studentId"}
    return render(request, 'democratic/index.html', context)


def fill(request):
    context = {"title": "请填写被评测人学号", "for": "input_studentId"}
    return render(request, 'democratic/fill.html', context)


@auth_democratic
def main(request):
    return render(request, 'democratic/main.html')


def signature(request):
    return render(request, 'democratic/signature.html')


@csrf_exempt
def save_signature(request):
    print("enter save")
    if request.method == "POST":
        print("post")
        post = request.POST
        imgbase64 = post.get('imgbase64')
        imgdata = base64.b64decode(imgbase64)
        if not os.path.exists(os.path.join(settings.MEDIA_ROOT, "signatureImage")):
            os.mkdir(os.path.join(settings.MEDIA_ROOT, "signatureImage"))
        filepath = os.path.join(settings.MEDIA_ROOT, "signatureImage", "default.jpg")
        with open(filepath, "wb+") as f:
            f.write(imgdata)
        print("保存成功")
        return HttpResponse("post")
    else:
        print(HttpResponse("123" + request.method))
        return HttpResponse("123" + request.method)


def authorize(request):
    # return render(request, 'democratic/authorize.html')
    return HttpResponse("ok")


def select_student(request, filled_student_id):
    filled_student = models.StudentInfo.objects.filter(studentId=filled_student_id)[0]
    if not filled_student_id:
        result = "false"
        context = {"result": result}
        return JsonResponse(context)
    else:
        result = "true"
        context = {"result": result}
        return JsonResponse(context)
        # print(filled_student_id[1])
        # name = filled_student.name
        # sfz = filled_student.sfz
        # gender = filled_student.gender
        # nation = filled_student.nation
        # department = filled_student.department
        # major = filled_student.major
        # clazz = filled_student.clazz
        # print(name, sfz, gender, nation, department, major, clazz)
        # context = {"studentId": filled_student_id, "name": name, "sfz": sfz, "gender": gender, "nation": nation,
        #            "department": department, "major": major, "clazz": clazz, "title": "请核对被评测人信息",
        #            "submit_appear": "true"}
        # return render(request, 'democratic/index.html', context)


@csrf_exempt
def index_handler(request):
    result = "ok"
    if request.method == 'POST':
        print("-----------------------------------")
        data = request.POST.dict()

        if data:
            print("-------------------123")
            print(data)
            if "filledStudentId" in data.keys():
                filledStudentId = data['filledStudentId']
                exist_student = FillStudentInfo.objects.filter(filledStudentId=filledStudentId)
                data.__delitem__("filledStudentId")
                if not exist_student:
                    fill_data = {
                        "filledStudentId": StudentInfo.objects.get(studentId=filledStudentId),
                    }
                    FillStudentInfo.objects.create(**fill_data)
                exist_student.update(**data)
            else:
                print("not in")
                result = "error"
        else:
            result = "error"
    return JsonResponse({"result": result})

def fill_sig(request):
    return render(request, 'democratic/fill_sig.html')
