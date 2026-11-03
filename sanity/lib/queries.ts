import { defineQuery } from 'groq'

export const COURSES_LIST_QUERY = defineQuery(`
  *[_type == "course"] | order(popular desc, title asc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    level,
    price,
    popular,
    studentCount,
    coverImage {
      ...,
      asset->{_id, url, metadata{dimensions, lqip}},
      alt
    },
    "instructor": instructor->{name, "slug": slug.current, photo{..., asset->{_id, url}, alt}},
    "category": category->{title, "slug": slug.current},
    "moduleCount": count(modules),
    "durationSeconds": math::sum(modules[].lessons[]->duration)
  }
`)

export const COURSE_SLUGS_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)] {
    "slug": slug.current
  }
`)

export const COURSE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "course" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage {
      ...,
      asset->{_id, url, metadata{dimensions, lqip}},
      alt
    },
    level,
    price,
    popular,
    studentCount,
    learningOutcomes[]{_key, icon, title, description},
    instructor->{_id, name, "slug": slug.current, photo{..., asset->{_id, url}, alt}, expertise, bio},
    category->{_id, title, "slug": slug.current, description},
    modules[]{
      _key,
      title,
      summary,
      "durationSeconds": math::sum(lessons[]->duration),
      lessons[]{
        _key,
        "_id": @->_id,
        "title": @->title,
        "slug": @->slug.current,
        "duration": @->duration,
        "freePreview": @->freePreview
      }
    },
    "moduleCount": count(modules),
    "lessonCount": count(modules[].lessons[]),
    "durationSeconds": math::sum(modules[].lessons[]->duration)
  }
`)

export const LESSON_SLUGS_QUERY = defineQuery(`
  *[_type == "lesson" && defined(slug.current)] {
    "slug": slug.current
  }
`)

export const LESSON_BY_SLUG_QUERY = defineQuery(`
  *[_type == "lesson" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    videoUrl,
    thumbnail{..., asset->{_id, url, metadata{dimensions, lqip}}, alt},
    duration,
    freePreview,
    studentCount,
    notes,
    keyPoints,
    proTip,
    resources[]{_key, type, title, description, url},
    "course": *[_type == "course" && references(^._id)][0] {
      _id,
      title,
      "slug": slug.current,
      coverImage {
        ...,
        asset->{_id, url, metadata{dimensions, lqip}},
        alt
      },
      level,
      instructor->{_id, name, "slug": slug.current, photo{..., asset->{_id, url}, alt}},
      modules[]{
        _key,
        title,
        "durationSeconds": math::sum(lessons[]->duration),
        lessons[]{
          _key,
          "_id": @->_id,
          "title": @->title,
          "slug": @->slug.current,
          "duration": @->duration,
          "freePreview": @->freePreview
        }
      }
    }
  }
`)

export const INSTRUCTORS_LIST_QUERY = defineQuery(`
  *[_type == "instructor"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    photo{..., asset->{_id, url, metadata{dimensions, lqip}}, alt},
    expertise,
    "courseCount": count(*[_type == "course" && references(^._id)])
  }
`)

export const INSTRUCTOR_BY_SLUG_QUERY = defineQuery(`
  *[_type == "instructor" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    photo{..., asset->{_id, url, metadata{dimensions, lqip}}, alt},
    expertise,
    bio,
    "courses": *[_type == "course" && references(^._id)] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      summary,
      level,
      price,
      popular,
      studentCount,
      coverImage{..., asset->{_id, url, metadata{dimensions, lqip}}, alt},
      "category": category->{title, "slug": slug.current},
      "moduleCount": count(modules),
      "durationSeconds": math::sum(modules[].lessons[]->duration)
    }
  }
`)

export const CATEGORIES_LIST_QUERY = defineQuery(`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "courseCount": count(*[_type == "course" && references(^._id)])
  }
`)
