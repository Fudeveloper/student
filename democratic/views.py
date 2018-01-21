from django.shortcuts import render
from django.http import HttpResponse
import base64
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import os


def index(request):
    return render(request, 'democratic/index.html')


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