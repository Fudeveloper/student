from django.shortcuts import redirect


# 判断是否已填写过index页面
def auth(func):
    def inner(request, *args, **kwargs):
        username = request.COOKIES.get('studentId')
        if not username:
            return redirect('/quantization/index/')
        return func(request, *args, **kwargs)

    return inner
