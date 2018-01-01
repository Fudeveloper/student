from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, FileResponse, StreamingHttpResponse

from django.views.decorators.csrf import csrf_exempt


# Create your views here.

def main(request):
    return render(request, 'quantization/main.html')


def test(request):
    return render(request, 'quantization/test.html')


def dy(request):
    return render(request, 'mobile/dy.html')


def common(request):
    return render(request, 'mobile/common.html')


def index2(request):
    return render(request, 'quantization/index2.html')


def index(request):
    return render(request, 'quantization/index.html')


@csrf_exempt
def index_handler(request):
    data = request.POST
    print(data)
    if data:
        result = "ok"
    else:
        result = "error"
    return JsonResponse({"result": result})


def base(request):
    return render(request, 'quantization/base.html')
