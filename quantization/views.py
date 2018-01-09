from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, FileResponse, StreamingHttpResponse
from .models import *
from django.views.decorators.csrf import csrf_exempt


# Create your views here.



def index(request):
    return render(request, 'quantization/index.html')


@csrf_exempt
def index_handler(request):
    data = request.POST
    print(data)
    if data:
        clazz = data.get('clazz')
        nation = data.get('nation')
        department = data.get('department')
        studentId = data.get('studentId')
        name = data.get('name')
        gender = data.get('gender')
        major = data.get('major')
        sfz = data.get('sfz')
        print(clazz)
        print(nation)
        print(department)
        print(studentId)
        print(name)
        print(gender)
        print(major)
        print(sfz)
        try:
            new_studentInfo = StudentInfo(clazz=clazz, nation=nation, department=department, studentId=studentId, name=name,
                                      gender=gender, major=major, sfz=sfz)
            new_studentInfo.save()
        except Exception as e:
            print(e)

        result = "ok"

        print(data.get('clazz'))

    else:
        result = "error"
    return JsonResponse({"result": result})


def main(request):
    return render(request, 'quantization/main.html')


def city(request):
    return render(request, 'quantization/city.html')


@csrf_exempt
def uploadimg(request):
    if request.method == 'POST':
        new_studentAnswer = StudentAnswer(
            baseDatum=request.FILES.get('img'),
            studentId=StudentInfo.objects.get(studentId="2016010978")
        )
        new_studentAnswer.save()
    return render(request, 'uploadimg.html')
