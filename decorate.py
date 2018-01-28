from django.shortcuts import redirect


# 判断是否已填写过量化index页面
def auth_quantization(func):
    def inner(request, *args, **kwargs):
        username = request.COOKIES.get('studentId')
        if not username:
            return redirect('/quantization/index/')
        return func(request, *args, **kwargs)

    return inner


# 判断是否已填写过量化index页面
def auth_democratic(func):
    def inner(request, *args, **kwargs):
        username = request.COOKIES.get('filled_student_id')
        if not username:
            return redirect('/democratic/index/')
        return func(request, *args, **kwargs)

    return inner
