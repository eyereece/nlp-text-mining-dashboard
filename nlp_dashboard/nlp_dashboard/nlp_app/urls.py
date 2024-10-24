from django.urls import path
from .views import (
    home,
    text_mining,
    get_releases_claps_by_week,
    get_releases_claps_by_day,
    get_claps_distribution,
    get_publisher_count,
    )

urlpatterns = [
    # PAGES
    path('', home, name='home'),
    path('text-mining/', text_mining, name="text-mining"),
    # APIs - home
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
    # bar-line chart: releases vs claps by day of week
    path(
        'api/releases-claps-by-day/',
        get_releases_claps_by_day,
        name='releases-claps-by-day',
    ),
    path(
        'api/releases-claps-by-day/<str:publisher>/',
        get_releases_claps_by_day,
        name='releases-claps-by-day',
    ),

    # box chart: claps distribution
    path('api/claps-distribution/', get_claps_distribution, name='claps-distribution'),

    # donut chart: articles count per publisher
    path('api/publisher-count/', get_publisher_count, name='publisher-count'),

    # bar chart: unique authors count per publisher

    # APIs - text mining
]