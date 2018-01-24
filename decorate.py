
from django.shortcuts import redirect


# 登录验证装饰器
def auth(func):
    def inner(request, *args, **kwargs):
        username = request.COOKIES.get('studentId')
        if not username:
            return redirect('/quantization/index/')
        return func(request, *args, **kwargs)
    return inner



