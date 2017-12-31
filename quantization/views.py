from django.shortcuts import render

# Create your views here.

def main(request):
    return render(request, 'quantization/main.html')


def test(request):
    return render(request, 'quantization/test.html')





def dy(request):
    return render(request, 'mobile/dy.html')

def common(request):
    return render(request, 'mobile/common.html')


def index(request):
    return render(request, 'quantization/index.html')
def index2(request):
    return render(request, 'quantization/index2.html')
