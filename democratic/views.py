from django.shortcuts import render


# Create your views here.

def main(request):
    return render(request, 'democratic/main.html')


def signature(request):
    return render(request, 'democratic/signature.html')
