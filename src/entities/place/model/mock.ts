// entities/place/model/mock.ts
import type { FavoritePointDTO } from '@/shared/api/point/types';

export const mockPlacesData: FavoritePointDTO[] = [
    {
        id: "82a22bf4-d167-422d-b957-0a79f13ac565",
        name: "Театр Маяковского. Сцена на Сретенке",
        description: "Театр Маяковского. Сцена на Сретенке — стильная площадка с камерной атмосферой для ценителей современного театра. Здесь ставят смелые интерпретации классики и актуальные пьесы в современном прочтении",
        image_url: "https://средадляжизни.рф/upload/sprint.editor/118/jg53c0ktt2wpr701k536k2nsg9nfq3j2/11-54ea4376634c4a54860d204c0870a7d1.jpg",
        average_rating: 0,
        reviews_count: 0,
        working_hours: {
            monday: "11:00-20:00",
            tuesday: "11:00-20:00",
            wednesday: "11:00-20:00",
            thursday: "11:00-20:00",
            friday: "11:00-20:00",
            saturday: "11:00-20:00",
            sunday: "11:00-20:00"
        },
        average_cost: 3000,
        city: "Москва",
        coordinates: { lat: 55.769043, lng: 37.630434 },
        note: "",
        added_at: new Date().toISOString()
    },
    {
        id: "7e182311-f9e3-4315-994e-71c90873351d",
        name: "Особняк Шехтеля",
        description: "Особняк Шехтеля — архитектурный бриллиант московского модерна. Асимметричные формы, изящные линии и декоративные элементы создают атмосферу эпохи Серебряного века, а каждый ракурс здания будто создан для эффектного фото",
        image_url: "https://vagankovo.net/wp-content/uploads/2023/08/photo-output-15.jpg",
        average_rating: 0,
        reviews_count: 0,
        working_hours: {
            monday: "круглосуточно",
            tuesday: "круглосуточно",
            wednesday: "круглосуточно",
            thursday: "круглосуточно",
            friday: "круглосуточно",
            saturday: "круглосуточно",
            sunday: "круглосуточно"
        },
        average_cost: 0,
        city: "Москва",
        coordinates: { lat: 55.766264, lng: 37.595387 },
        note: "",
        added_at: new Date().toISOString()
    },
    {
        id: "7276a735-b4fd-40e5-9640-c7b94ed9e22a",
        name: "Музей-мастерская Людмилы Гурченко",
        description: "Музей‑мастерская Людмилы Гурченко — это квартира актрисы, ставшая музеем в 2016 году. Здесь хранятся её авторские костюмы, коллекция уранового стекла, антикварная мебель и подарки от знаменитых друзей — всё, что раскрывает многогранный талант и изысканный вкус легенды советского кино",
        image_url: "https://avatars.mds.yandex.net/get-altay/7982580/2a0000018922dc0c73382a50045d6d6477e9/orig",
        average_rating: 0,
        reviews_count: 0,
        working_hours: {
            monday: "выходной",
            tuesday: "выходной",
            wednesday: "10:00-17:00",
            thursday: "10:00-17:00",
            friday: "10:00-17:00",
            saturday: "10:00-17:00",
            sunday: "10:00-17:00"
        },
        average_cost: 1000,
        city: "Москва",
        coordinates: { lat: 55.765705, lng: 37.594987 },
        note: "",
        added_at: new Date().toISOString()
    },
    {
        id: "6d5b2811-5725-4126-9f62-057c73b5a38f",
        name: "Большой Патриарший переулок",
        description: "Большой Патриарший переулок — атмосферный уголок старой Москвы рядом с Патриаршими прудами. Здесь царит особая литературная аура, а старинные особняки и уютные кафе создают настроение для неспешных прогулок и красивых фото",
        image_url: "https://images.mlabspb.ru/uploads/97/d2/97d2710f07d6a5d4fe7075eb8123de2a.jpg",
        average_rating: 0,
        reviews_count: 0,
        working_hours: {
            monday: "круглосуточно",
            tuesday: "круглосуточно",
            wednesday: "круглосуточно",
            thursday: "круглосуточно",
            friday: "круглосуточно",
            saturday: "круглосуточно",
            sunday: "круглосуточно"
        },
        average_cost: 0,
        city: "Москва",
        coordinates: { lat: 55.763245, lng: 37.593066 },
        note: "",
        added_at: new Date().toISOString()
    },
    {
        id: "6ce2c135-49d8-45ed-aa9f-25ec52a13f87",
        name: "Музей холодной войны (экспозиционный комплекс Бункер-42)",
        description: "Музей холодной войны (Бункер‑42 на Таганке) — подземный комплекс на глубине 65 метров, где оживает эпоха ядерного противостояния. Здесь можно пройтись по секретным тоннелям, увидеть макет первой советской ядерной бомбы и даже «запустить ракету» на интерактивном командном пункте",
        image_url: "https://s12.stc.all.kpcdn.net/russia/wp-content/uploads/2020/04/bunker-42-1330-1060x644.jpg",
        average_rating: 0,
        reviews_count: 0,
        working_hours: {
            monday: "10:00-21:00",
            tuesday: "10:00-21:00",
            wednesday: "10:00-21:00",
            thursday: "10:00-21:00",
            friday: "10:00-21:00",
            saturday: "10:00-21:00",
            sunday: "10:00-21:00"
        },
        average_cost: 750,
        city: "Москва",
        coordinates: { lat: 55.741646, lng: 37.649108 },
        note: "",
        added_at: new Date().toISOString()
    },
    {
        id: "5aa5b4c1-06ce-4725-8917-49f9927fe9e7",
        name: "Музей уникальных кукол",
        description: "Музей уникальных кукол — волшебный особняк на Покровке, где оживает история кукольного искусства: здесь собраны антикварные куклы со всего мира, от деревянной фигурки младенца Иисуса возрастом 350 лет до куклы из фильма «Три толстяка», а каждый экспонат хранит свою историю",
        image_url: "https://avatars.mds.yandex.net/get-altay/13941727/2a00000194e79607b33f84817c800eff5695/XXXL",
        average_rating: 0,
        reviews_count: 0,
        working_hours: {
            monday: "12:00-19:00",
            tuesday: "12:00-19:00",
            wednesday: "12:00-17:00",
            thursday: "12:00-17:00",
            friday: "12:00-17:00",
            saturday: "12:00-19:00",
            sunday: "12:00-19:00"
        },
        average_cost: 300,
        city: "Москва",
        coordinates: { lat: 55.759307, lng: 37.644509 },
        note: "",
        added_at: new Date().toISOString()
    },
    {
        id: "5878a583-00e0-49d0-8454-1d39bf5ede11",
        name: "Парк «Зарядье»",
        description: "Парк «Зарядье» — современный городской оазис в сердце Москвы с панорамными видами на Кремль и Москву‑реку, «парящим мостом» и климатическими зонами: здесь природа встречается с инновациями, а каждая дорожка ведёт к новому открытию",
        image_url: "https://optim.tildacdn.com/tild6532-6566-4562-b062-396362656237/-/format/webp/KIR_2178.jpg.webp",
        average_rating: 0,
        reviews_count: 0,
        working_hours: {
            monday: "круглосуточно",
            tuesday: "круглосуточно",
            wednesday: "круглосуточно",
            thursday: "круглосуточно",
            friday: "круглосуточно",
            saturday: "круглосуточно",
            sunday: "круглосуточно"
        },
        average_cost: 0,
        city: "Москва",
        coordinates: { lat: 55.750933, lng: 37.629067 },
        note: "",
        added_at: new Date().toISOString()
    },
    {
        id: "57e766c7-de1d-4016-ad03-7b5d3f058543",
        name: "Деревья любви",
        description: "Деревья любви на Лужковом мосту — романтичное место в центре Москвы: металлические скульптуры, увешанные замками влюблённых, стали символом верности и красивой городской традицией, а рядом стоит Скамья примирения для тех, кто хочет забыть обиды",
        image_url: "https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_67976dca072fd32ca75b8f31_679884f971bec7618d0f70dd/scale_1200",
        average_rating: 0,
        reviews_count: 0,
        working_hours: {
            monday: "круглосуточно",
            tuesday: "круглосуточно",
            wednesday: "круглосуточно",
            thursday: "круглосуточно",
            friday: "круглосуточно",
            saturday: "круглосуточно",
            sunday: "круглосуточно"
        },
        average_cost: 0,
        city: "Москва",
        coordinates: { lat: 55.74435, lng: 37.618611 },
        note: "",
        added_at: new Date().toISOString()
    },
    {
        id: "54df0f96-a56d-4e4f-9716-0bcc0abc88d4",
        name: "Котофейня",
        description: "«Котофейня» — уютное тайм‑кафе, где можно отдохнуть в компании ласковых котиков, поиграть в настольные игры и выпить чашечку чая; атмосфера тепла и мурчания помогает забыть о городской суете и зарядиться позитивом",
        image_url: "https://sb-ugra.ru/upload/resize_cache/iblock/e10/1280_1024_1/KH030210.jpg",
        average_rating: 0,
        reviews_count: 0,
        working_hours: {
            monday: "11:00-22:00",
            tuesday: "11:00-22:00",
            wednesday: "11:00-22:00",
            thursday: "11:00-22:00",
            friday: "11:00-22:00",
            saturday: "10:00-22:00",
            sunday: "10:00-22:00"
        },
        average_cost: 800,
        city: "Москва",
        coordinates: { lat: 55.757464, lng: 37.637162 },
        note: "",
        added_at: new Date().toISOString()
    },

    {
        id: "3715269d-d46b-4985-b5d3-185a9e362695",
        name: "Садовническая набережная",
        description: "Садовническая набережная — живописный берег Москвы‑реки с видами на мосты, старинные здания и современные бизнес‑центры. Здесь можно неспешно гулять, ловить закаты и ловить в кадр городские контрасты: от исторических фасадов до стеклянных высоток",
        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Sadovnicheskaya_Embankment_in_Moscow_-_view_from_Ozerkovskaya_Embankment_01.jpg/1280px-Sadovnicheskaya_Embankment_in_Moscow_-_view_from_Ozerkovskaya_Embankment_01.jpg?utm_source=ru.wikipedia.org&utm_campaign=index&utm_content=thumbnail",
        average_rating: 0,
        reviews_count: 0,
        working_hours: {
            monday: "Круглосуточно",
            tuesday: "Круглосуточно",
            wednesday: "Круглосуточно",
            thursday: "Круглосуточно",
            friday: "Круглосуточно",
            saturday: "Круглосуточно",
            sunday: "Круглосуточно"
        },
        average_cost: 0,
        city: "Москва",
        coordinates: { lat: 55.740031, lng: 37.640666 },
        note: "",
        added_at: new Date().toISOString()
    },
    {
        id: "29768851-295e-4855-9d78-0740f32e6ad2",
        name: "По сусекам",
        description: "«По сусекам» — интерактивный музей-пекарня, где оживает история русского хлебопечения: от старинных рецептов до обрядов и традиций. Здесь можно увидеть аутентичные инструменты, узнать, как готовили хлеб в старину, и даже поучаствовать в мастер‑классах по выпечке",
        image_url: "https://cdnstatic.rg.ru/uploads/photogallery/2022/10/09/mihr6600jpg_f9a.jpg",
        average_rating: 0,
        reviews_count: 0,
        working_hours: {
            monday: "выходной",
            tuesday: "выходной",
            wednesday: "выходной",
            thursday: "выходной",
            friday: "12:00-18:00",
            saturday: "12:00-18:00",
            sunday: "12:00-18:00"
        },
        average_cost: 500,
        city: "Москва",
        coordinates: { lat: 55.743769, lng: 37.610867 },
        note: "",
        added_at: new Date().toISOString()
    },
    {
        id: "1f28b96b-8979-48f4-9922-3c3ec24b2d48",
        name: "Около дома Станиславского",
        description: "«Около дома Станиславского» — камерный театр с экспериментальными постановками в самом сердце Москвы. Здесь царит особая атмосфера: небольшие залы, близость к сцене и нестандартные трактовки классических сюжетов создают эффект полного погружения в действие",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaEH5XH2XD8k-4NfvKB0-X_3AbBhK7TYPMdQ&s",
        average_rating: 0,
        reviews_count: 0,
        working_hours: {
            monday: "12:00-20:00",
            tuesday: "12:00-20:00",
            wednesday: "12:00-20:00",
            thursday: "12:00-20:00",
            friday: "12:00-21:00",
            saturday: "12:00-21:00",
            sunday: "12:00-20:00"
        },
        average_cost: 2000,
        city: "Москва",
        coordinates: { lat: 55.758311, lng: 37.604389 },
        note: "",
        added_at: new Date().toISOString()
    }
];