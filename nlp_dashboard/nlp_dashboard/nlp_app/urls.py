from django.urls import path
from .views import home, text_mining

urlpatterns = [
    path('', home, name='home'),
    path('text-mining/', text_mining, name="text-mining"),
]