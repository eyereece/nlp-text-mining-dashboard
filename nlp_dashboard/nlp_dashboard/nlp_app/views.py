from django.shortcuts import render
from django.http import HttpResponse
from .models import Articles

# Create your views here.
def home(request):
    articles = Articles.objects.all()[:10]
    return render(request, 'home.html', {
        'articles': articles
    })
