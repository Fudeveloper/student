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
def save_signature(request, filled_student_id):
    print("enter save")
    if request.method == "POST":
        pk = request.COOKIES.get("pk")
        current_fill_student = FillStudentInfo.objects.filter(pk=pk)
        print("--------------------------")
        img_path = os.path.join(settings.MEDIA_ROOT, "signatureImage",
                                filled_student_id + "_{}_{}.jpg".format("signature", pk))
        save_path = os.path.join("signatureImage",
                                 filled_student_id + "_{}_{}.jpg".format("signature", pk))
        post = request.POST
        imgbase64 = post.get('imgbase64')
        imgdata = base64.b64decode(imgbase64)
        if os.path.exists(img_path):
            os.remove(img_path)
        if not os.path.exists(os.path.join(settings.MEDIA_ROOT, "signatureImage")):
            os.mkdir(os.path.join(settings.MEDIA_ROOT, "signatureImage"))
        # filepath = os.path.join(settings.MEDIA_ROOT, "signatureImage", "default.jpg")
        with open(img_path, "wb+") as destination:
            destination.write(imgdata)
        # FillStudentInfo.objects.create(pk=filled_student_id)

        if not current_fill_student:
            return JsonResponse({"status": "false"})
        update_dic = {"signature": save_path}
        current_fill_student.update(**update_dic)
        return JsonResponse({"status": "true"})


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
        data = request.POST.dict()

        if data:
            print(data)
            if "filledStudentId" in data.keys():
                filledStudentId = data['filledStudentId']
                # FillStudentInfo.objects.create(pk=filledStudentId)
                name = data["name"]
                job = data["job"]
                # print(name)
                # print(job)
                s = StudentInfo.objects.get(pk=filledStudentId)
                fsi = FillStudentInfo(name=name, job=job)
                fsi.save()
                fsi.filledStudentId.add(s)
                print(fsi.pk)
                print(s.fillstudentinfo_set.all())

                fsi.save()
                # 取得存入时数据的id，以供保存成绩，签名时使用
                pk = fsi.pk
            else:
                pk = -1
                print("not in")
                result = "error"
        else:
            pk = -1
            result = "error"
    return JsonResponse({"result": result, "pk": pk})


@csrf_exempt
def main_handler(request):
    pk = request.COOKIES.get("pk")
    result = "ok"
    if request.method == 'POST':
        data = request.POST.dict()
        if data:
            print(data)
            if "filledStudentId" in data.keys():
                filledStudentId = data['filledStudentId']
                exist_student = FillStudentInfo.objects.filter(pk=pk)
                print(exist_student)
                if exist_student:
                    data.__delitem__("filledStudentId")
                    # print(data)
                    exist_student.update(**data)
        else:
            print("---------------无studentid")
            result = "error"
    else:
        result = "error"

    return JsonResponse({"result": result})
