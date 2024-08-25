erDiagram
    POST ||--o{ CONTENT_BLOCK : contains
    POST ||--o{ FEED_ITEM : generates
    POST }o--|| USER : authored_by
    POST }o--|| SCHOOL : belongs_to
    POST }o--o{ CATEGORY : categorized_in
    POST }o--o{ TAG : tagged_with
    POST }o--|| LOCATION : visible_in
    USER ||--o{ POST : creates
    USER }o--|| SCHOOL : belongs_to
    USER }o--|| LOCATION : located_in
    SCHOOL }o--|| LOCATION : located_in
    LOCATION ||--o{ LOCATION : has
    SCHOOL ||--o{ GALLERY : has
    GALLERY ||--o{ GALLERY_ITEM : contains

    POST {
        string PostID PK
        string authorId FK
        string authorName
        string authorRole
        string schoolId FK
        datetime createdAt
        datetime updatedAt
        string title
        string summary
        enum contentType "ANNOUNCEMENT|EVENT|NEWS|POLL"
        array categories
        array tags
        string targetAudience
        enum visibilityLevel "STATE|DISTRICT|MANDAL|SCHOOL"
        int likeCount
        int commentCount
        int shareCount
        string locationId FK
    }

    CONTENT_BLOCK {
        string BlockID PK
        string PostID FK
        enum type "TEXT|IMAGE|POLL|VIDEO|LINK|FILE|QUIZ|CAROUSEL"
        int order
        datetime createdAt
        datetime updatedAt
        string text
        string imageUrl
        string imageCaption
        string pollQuestion
        array pollOptions
        int pollTotalResponses
        enum pollType "SINGLE_CHOICE|MULTIPLE_CHOICE"
        string videoUrl
        string videoThumbnailUrl
        string videoDuration
        string linkUrl
        string linkTitle
        string linkDescription
        string fileUrl
        string fileName
        int fileSize
        string fileType
        string quizTitle
        array quizQuestions
        datetime quizExpiresAt
        array carouselItems
    }

    FEED_ITEM {
        string FeedID PK
        string PostID FK
        datetime timestamp
        string authorName
        string authorRole
        string schoolId FK
        string title
        string summary
        enum contentType "ANNOUNCEMENT|EVENT|NEWS|POLL"
        array categories
        array tags
        string targetAudience
        enum visibilityLevel "STATE|DISTRICT|MANDAL|SCHOOL"
        string thumbnailUrl
        int likeCount
        int commentCount
        int shareCount
    }

    CATEGORY {
        string CategoryID PK
        string name
        string description
    }

    TAG {
        string TagID PK
        string name
    }

    USER {
        string UserID PK
        string name
        string email
        enum role "TEACHER|PRINCIPAL|ADMIN|PARENT|STUDENT"
        string schoolId FK
        string state FK
        string district FK
        string mandal FK
        array preferredCategories
        array preferredTags
    }

    SCHOOL {
        string SchoolID PK
        string name
        string state FK
        string district FK
        string mandal FK
    }

    LOCATION {
        string LocationID PK
        string parentLocationID FK
        string name
        enum type "STATE|DISTRICT|MANDAL|SCHOOL"
    }

    GALLERY {
        string GalleryID PK
        string SchoolID FK
        string name
        string description
        datetime createdAt
        datetime updatedAt
    }

    GALLERY_ITEM {
        string ItemID PK
        string GalleryID FK
        string imageUrl
        string title
        string description
        datetime uploadedAt
        string uploadedBy FK
        int orderIndex
        enum type "IMAGE|VIDEO"
        string thumbnailUrl
        string videoDuration
    }
