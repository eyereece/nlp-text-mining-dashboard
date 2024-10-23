from django.urls import path
from .views import (
    home,
    text_mining,
    get_releases_claps_by_week)

urlpatterns = [
    # PAGES
    path('', home, name='home'),
    path('text-mining/', text_mining, name="text-mining"),
    # APIs
    # line chart
    path(
        "api/releases-claps-by-week/",
        get_releases_claps_by_week,
        name="releases-claps-by-week",
    ),
    path(
        "api/releases-claps-by-week/<str:publisher>/",
        get_releases_claps_by_week,
        name="releases-claps-by-week",
    ),
]