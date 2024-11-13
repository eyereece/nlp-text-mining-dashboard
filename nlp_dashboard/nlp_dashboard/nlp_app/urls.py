from django.urls import path
from .views import (
    home,
    text_mining,
    walkthrough,
    about,
    get_releases_claps_by_week,
    get_releases_claps_by_day,
    get_claps_distribution,
    get_publisher_count,
    get_nunique_authors,
    get_bigram,
    get_above_avg_bigram,
    get_trigram,
    get_above_avg_trigram,
    get_lda,
    get_above_avg_lda,
)

urlpatterns = [
    # PAGES
    path("", home, name="home"),
    path("text-mining/", text_mining, name="text-mining"),
    path("walkthrough/", walkthrough, name="walkthrough"),
    path("about/", about, name="about"),
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
        "api/releases-claps-by-day/",
        get_releases_claps_by_day,
        name="releases-claps-by-day",
    ),
    path(
        "api/releases-claps-by-day/<str:publisher>/",
        get_releases_claps_by_day,
        name="releases-claps-by-day",
    ),
    # box chart: claps distribution
    path("api/claps-distribution/", get_claps_distribution, name="claps-distribution"),
    # donut chart: articles count per publisher
    path("api/publisher-count/", get_publisher_count, name="publisher-count"),
    # bar chart: unique authors count per publisher
    path("api/nunique-authors/", get_nunique_authors, name="nunique-authors"),
    # APIs - text mining
    # bigram
    path("api/bigram/", get_bigram, name="bigram"),
    path("api/bigram/<str:publisher>/", get_bigram, name="bigram"),
    # above average bigram
    path("api/above-avg-bigram/", get_above_avg_bigram, name="above-avg-bigram"),
    path(
        "api/above-avg-bigram/<str:publisher>/",
        get_above_avg_bigram,
        name="above-avg-bigram",
    ),
    # trigram
    path("api/trigram/", get_trigram, name="trigram"),
    path("api/trigram/<str:publisher>/", get_trigram, name="trigram"),
    # above average trigram
    path("api/above-avg-trigram/", get_above_avg_trigram, name="above-avg-trigram"),
    path(
        "api/above-avg-trigram/<str:publisher>/",
        get_above_avg_trigram,
        name="above-avg-trigram",
    ),
    # LDA
    path("lda/", get_lda, name="lda-all"),
    path("lda/<str:publisher>/", get_lda, name="lda-publisher"),
    # above average LDA
    path("above-avg-lda/", get_above_avg_lda, name="above-avg-lda"),
    path(
        "above-avg-lda/<str:publisher>/",
        get_above_avg_lda,
        name="above-avg-lda-publisher",
    ),
]
