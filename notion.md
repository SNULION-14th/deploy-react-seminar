# 10주차: API 연결(2026v)

## 🦁 세미나 개요 🦁

한 학기 동안 멋사 블로그를 완성하는 것을 목표로 하고 있으며, 지난 3주 동안 블로그 서버에서 필요한 다양한 기능들을 구현했습니다. 오늘은 백엔드와 프론트엔드가 서로 소통할 수 있도록 연결해보겠습니다.

---

# 0️⃣ Recap

## 동기화

여러 유저가 동일한 화면을 볼 수 있으려면 프론트엔드가 아닌 **백엔드 쪽에서 데이터를 저장**해야돼요.

<aside>
📌 **알고 계셨나요?

백엔드와의 데이터 통신을 통해 CRUD 진행 시 데이터 저장과 동기화를 보장할 수 있어요!**

</aside>

이제는 백엔드 서버까지 구축했기 때문에 **더미데이터 대신 백엔드와 데이터 통신**을 통해 본격적인 웹 서비스에 다가가보도록 합시다!

그렇다면, 백엔드 서버와 데이터 통신은 어떻게 하는걸까요? 6주차때 HTTP에 대해서 배웠었죠?

## HTTP(Hypertext Transfer Protocol)

[HTTP 개요 - HTTP | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Overview)

![image.png](attachment:1bf48237-3cd0-41a8-8f45-7d5f1417013a:image.png)

<aside>
💡

**알고 계셨나요?

HTTP 메시지는 서버와 클라이언트 간에 데이터가 교환되는 방식입니다.**
**메시지 타입은 2가지가 있습니다.**

- **HTTP Request(요청)** : 프론트 → 백
- **HTTP Response(응답)** : 백 → 프론트
</aside>

- **HTTP Messages**
    
    Request 와 Response가 어떻게 생겼는지, 어떤 정보들이 들어있는지 들여다봅시다.
    
    HTTP Message는 **`Header`  와 `Body`** 로 이루어져 있어요.
    
    `Body` 에 대해서는 백엔드 세미나에서 많이 익숙해졌을 거라 생각해서, **`Header` 를 중점적으로** 들여다볼게요
    
    - **`Header` :** **Request/Response의 메타데이터** (어떤 요청인지, 어떤 응답이지 알려주는 정보들)
    - **`Body` (Optional) :** 실제 전달되는 데이터. **전달할 데이터가 따로 없는 경우에는 `Body` 가 필요 없어요**
        - `GET` 요청은 body가 필요할까요?
        - `POST` 요청은 body가 필요할까요?
    
    ![Untitled](attachment:0dc5b355-1aef-47a4-9120-30714c369d05:Untitled.png)
    
    - HTTP에 대해 궁금하신 분은 여기 링크를 참고하세요
        
        [HTTP 메시지 - HTTP | MDN](https://developer.mozilla.org/ko/docs/Web/HTTP/Messages)
        
        [[Web] HTTP와 Request, Response의 개념 이해](https://velog.io/@bky373/Web-HTTP와-HTTPS-초간단-정리)
        
    
    ### Request Header
    
    Header에는 되게되게되게되게 많은 정보들이 담겨있어요.
    
    근데 다 보면 머리아프니까, 우리한테 중요한 것만 살펴볼게요
    
    - **Accept:** 클라이언트가 **이해 가능한 (허용하는) 파일 형식** (MIME TYPE) - **데이터를 받을 때 사용**
        
        ⇒ 우리는 **`JSON`** 형식을 사용할거에요
        
    - **Authorization:** **인증 토큰(JWT나 Bearer 토큰)**을 서버로 보낼 때 토큰 정보가 담기는 헤더, API 요청을 할 때 토큰이 없으면 거절을 당하기 때문에 이 때, `Authorization`을 사용
        
        ⇒ 백엔드 세미나에서 만들었던 **`JWT` 토큰** 써먹을거에요
        
    - **Origin(Host):** 요청이 **어느 주소에서 시작되었는지**를 나타냄. 여기서 **요청을 보낸 주소와 받는 주소가 다르면** **CORS문제가 발생**하기도 함
        
        ⇒ **CORS 문제 해결을 위한 거에요. (이거 집중 안하면 해커톤이 힘들어질거에요,,)**
        
    
    ![response header.png](attachment:f429c351-0690-4969-a401-a49fe24f647c:response_header.png)
    
    ---
    
    - **Access-Control-Allow-Origin**: 응답 메시지 **Access-Control-Allow-Origin 헤더에 프론트 주소를 적어주면** **CORS 에러**가 발생하지 않는다.
        
        ex) `Access-Control-Allow-Origin: www.sample.com` / `Access-Control-Allow-Origin: *`
        
        - Request의 `Origin(Host)` 주소가 Response의 **`Access-Control-Allow-Origin` 목록에 있어야 해요**
        - **즉, 허락된 주소 목록에 속한 클라이언트의 요청만 허락되는 거에요!**
    - **Content-Type**: 콘텐츠의 미디어 타입(MIME Type). 반환된 콘텐츠 타입이 실제로 무엇인지 클라이언트에게 알려줌. **(데이터를 보낼 때 사용)**
        - 클라이언트도 데이터를 보낼 때 (ex. `POST` )는 `Content-Type` 을 사용할 수 있어요.
        - 데이터를 “보내는” 주체가 Header에 담는 정보입니다.
        (`Accept` 는 데이터를 “받는” 쪽에서 Header에 담는 정보입니다. )
            
            [Contents-Type Header 와 Accept Header의 차이점](https://webstone.tistory.com/66)
            
    - **Set-Cookie** : **쿠키 설정해주는 부분**
        - **Set-Cookie**: 서버 측에서 **클라이언트에게 세션 쿠키 정보를 설정**할 때 사용하는 항목 (RFC 2965에서 규정)
            
            ex) `Set-Cookie: zerocho=babo; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly`
            
            우리는 백엔드에서 로그인을 할 때 `Set-Cookie` 를 사용해봤죠 이미?
            
            ```python
            # account/views.py
            def set_token_on_response_cookie(user:User) -> Response:
                token = RefreshToken.for_user(user)
                user_profile = UserProfile.objects.get(user=user)
                user_profile_serializer = UserProfileSerializer(user_profile)
                res = Response(user_profile_serializer.data, status=status.HTTP_200_OK)
                **res.set_cookie('refresh_token', value=str(token), httponly=True)
                res.set_cookie('access_token', value=str(token.access_token), httponly=True)**
                return res
            ```
            
            **즉, 프론트의 쿠키에 백엔드가 `Set-Cookie` 를 통해 정보를 담을 수 있어요!!**
            
            - (참고사항) HttpOnly 쿠키
                
                > **HttpOnly:**
                > 
                > - 자바스크립트에서 쿠키에 접근할 수 없다.
                > - XSS 요청을 막으려면 활성화해두는 것이 좋다.
                
                쿠키는 **XSS 공격과 CSRF 공격 등에 취약**하기 때문에 **HttpOnly 옵션을 켜두고**, 쿠키를 사용하는 요청은 서버 단에서 검증하는 로직을 마련해두는 것이 좋다.
                
            
            [세션 vs 토큰 vs 쿠키? 기초개념 잡아드림. 10분 순삭!](https://www.youtube.com/watch?v=tosLBcAX1vk)
            
    
    ### Request Body
    
    Body는 실제 데이터가 담기는 부분이에요.
    
    `POST` 요청에서 서버에 보내야 하는 데이터들!
    
    ex. 로그인 시 `id` `password` … 이런 애들
    
    ex. signin api
    
    ```json
    body {
        id: "test",
    		password: "password"
    }
    ```
    

### 🌐 Axios란?

[시작하기 | Axios Docs](https://axios-http.com/kr/docs/intro)

**Axios**는 **웹사이트의 프론트엔드와 백엔드 서버 사이의 통신을 돕는 도구**입니다. 자바스크립트에서 사용되는 인기 있는 라이브러리로, 웹 브라우저나 Node.js 환경에서 HTTP 요청을 쉽게 보내고 받을 수 있게 해줍니다.

### ✅ Axios의 주요 장점

- **간편한 사용법**: 직관적인 API를 제공하여 복잡한 HTTP 요청도 쉽게 처리할 수 있습니다.
- **브라우저와 Node.js 지원**: Axios는 브라우저뿐만 아니라 Node.js 환경에서도 활용할 수 있습니다.
- **자동 변환**: 서버에서 받은 데이터를 자동으로 JSON 형식으로 변환해줍니다.
- **요청 취소 기능**: 필요할 경우 요청을 취소할 수 있습니다.
- **요청 및 응답 인터셉트**: 요청을 보내기 전이나 응답을 받기 전에 데이터를 가공할 수 있습니다.

Axios를 활용하면 프론트엔드와 백엔드 간의 데이터 송수신을 더욱 효율적으로 수행할 수 있으며, 블로그 프로젝트에서도 유저 인증 및 데이터 통신에 적극 활용할 수 있습니다.

### 🔍 RESTful API란?

**RESTful API**는 REST 원칙을 따르는 API를 말합니다. 이는 웹 상에서 다양한 클라이언트(브라우저, 모바일 앱 등)와 서버 간에 정보를 교환할 때 사용되는 일련의 규칙과 제약 조건을 의미합니다. RESTful API는 마치 식당에서 음식을 주문하는 과정처럼, 웹 상에서 데이터를 주고받는 방식을 간소화하고 표준화합니다.

### ✅ RESTful API의 핵심 개념

- **리소스(Resource)**: 웹 상의 정보나 서비스를 나타내며, 각 리소스는 고유한 URI(Uniform Resource Identifier)를 가집니다. 예를 들어, 특정 사용자의 정보를 나타내는 리소스는 `/users/{userId}`와 같은 URI를 가질 수 있습니다.
- **메소드(Method)**: 리소스에 대해 수행하려는 작업을 나타냅니다. 주로 사용되는 HTTP 메소드에는:
    - `GET`: 리소스 조회
    - `POST`: 리소스 생성
    - `PUT`: 리소스 업데이트
    - `DELETE`: 리소스 삭제
- **표현(Representation)**: 클라이언트와 서버 간에 교환되는 데이터의 형식을 말합니다. 대표적으로 JSON(JavaScript Object Notation)이나 XML(eXtensible Markup Language) 형식이 사용됩니다.

## 🍔 식당 비유로 이해하는 RESTful API

| 구성 요소 | 식당에서의 비유 | 웹에서의 의미 |
| --- | --- | --- |
| 클라이언트 | 손님 (당신) | 브라우저, 앱 등 요청하는 쪽 |
| 서버 | 주방 | 데이터를 처리하고 응답하는 쪽 |
| API | 웨이터 | 손님과 주방 사이에서 전달자 역할 |
| 자원(Resource) | 음식 메뉴 | 서버에 있는 데이터 (예: 사용자, 게시글) |
| URL | 메뉴판에서 음식 번호 | 자원을 지정하는 주소 (예: `/users/1`) |
| HTTP 메서드 | 행동 방식 (주문하기, 수정하기 등) | `GET`, `POST`, `PUT`, `DELETE` |

---

## 🍜 주문 과정 = REST API 호출 과정

| 단계 | 식당에서 | REST 요청 | Body 포함 여부 |
| --- | --- | --- | --- |
| 1. 메뉴를 본다 | "짬뽕 주세요" | `GET /menu/jjamppong` | ❌ 없음 (조회만 하므로 불필요) |
| 2. 메뉴 추가 제안 | "새 메뉴 제안할게요" | `POST /menu` | ✅ 있음 → `{ "name": "간장라면", "price": 8000 }` |
| 3. 기존 메뉴 수정 | "짬뽕 맵기 조절해주세요" | `PUT /menu/jjamppong` | ✅ 있음 → `{ "spicy": true }` |
| 4. 메뉴 삭제 요청 | "짬뽕은 빼주세요" | `DELETE /menu/jjamppong` | ❌ 없음 (삭제 대상만 명시하면 됨) |

**RESTful API**는 표준화된 방식으로 정보를 주고받음으로써, 다양한 웹 사이트와 앱들이 서로 효율적으로 '대화'할 수 있도록 해줍니다. RESTful API의 간결하고 명확한 구조는 개발자들이 이해하기 쉽고, 다양한 플랫폼과 프로그래밍 언어에서 활용할 수 있도록 합니다.

- **RESTful API**에 대해 더 궁금하시다면?
    
    [RESTful API란 무엇인가요? - RESTful API 설명 - AWS](https://aws.amazon.com/ko/what-is/restful-api/)
    

## DRF (Django REST Framework)

- **Django REST Framework (DRF)**는 Python 웹 프레임워크인 Django를 기반으로 **RESTful API**를 쉽게 구축할 수 있도록 돕는 강력한 도구입니다. RESTful API의 개념을 이해했다면, DRF는 이를 더욱 편리하게 구현할 수 있는 '도구 상자'와 같습니다.

Django는 웹 개발을 위한 다양한 기능(데이터베이스 관리, 사용자 인증, 템플릿 시스템 등)을 제공하며, DRF는 이를 확장하여 **RESTful API** 개발을 더욱 간결하고 효율적으로 만들어 줍니다.

---

### 🔍 RESTful API와 DRF

앞서 살펴본 **RESTful API**의 핵심 요소들을 **Django**와 **DRF**를 활용하는 방식으로 정리하면 다음과 같습니다.

## 1. 리소스(Resource) = **데이터 하나하나의 단위**

> **Django 모델(Model)**을 기반으로 자동으로 API가 만들어져요.
> 

### 💡 예시:

```python
class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=50)
```

이런 모델이 있다면, DRF는 이걸 **책(Book)**이라는 "리소스"로 보고 다음과 같은 API를 자동으로 만들어줘요:

| 기능 | URL 예시 | 설명 |
| --- | --- | --- |
| 조회 | `GET /books/` | 모든 책 목록 조회 |
| 생성 | `POST /books/` | 새 책 등록 |
| 수정 | `PUT /books/3/` | ID가 3인 책 수정 |
| 삭제 | `DELETE /books/3/` | ID가 3인 책 삭제 |

---

## 🧭 2. 메소드(Method) = **어떻게 행동할까?**

HTTP 메소드로 동작이 정해져요. 자주 쓰이는 건 이 네 가지예요:

| 메소드 | 의미 | 용도 |
| --- | --- | --- |
| `GET` | 가져오기 | 데이터 조회 |
| `POST` | 새로 만들기 | 데이터 생성 |
| `PUT` | 통째로 바꾸기 | 데이터 수정 (전체) |
| `DELETE` | 없애기 | 데이터 삭제 |

→ 뷰(View)에서 이 메소드에 따라 어떤 처리를 할지 정해줄 수 있어요.

---

## 🔄 3. 표현(Representation) = **데이터 포장/변환 도구**

> **시리얼라이저(Serializer)**가 이 역할을 해요.
> 

### 🗃️ 왜 필요해?

- 데이터는 데이터베이스 안에 **파이썬 객체**로 저장돼 있어요.
- 근데 클라이언트(브라우저, 앱)는 **JSON**이나 **XML** 형식만 이해해요.
- 그래서 **시리얼라이저가 변환(직렬화/역직렬화)**을 해줘요.

### 🎁 역할 2가지:

1. **출력할 때:** 파이썬 객체 → JSON으로 변환
2. **입력 받을 때:** JSON 요청 → 모델 객체로 변환 + 유효성 검사

```python
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author']
```

---

## 비유로 정리

| 개념 | 쉬운 비유 |
| --- | --- |
| 리소스 | "책", "회원", "게시글" 같은 **데이터의 대상** |
| 메소드 | "무엇을 할 건지" (읽기/쓰기/지우기 등) |
| 표현 | 데이터를 **예쁘게 포장하거나**, **원래 형태로 되돌리는** 포장기계 (시리얼라이저) |

---

### 🚀 DRF를 사용하는 주요 이점

✅ **빠른 API 개발**: DRF는 Django 모델을 기반으로 자동으로 API 엔드포인트를 생성할 수 있어 개발 시간을 단축합니다.

✅ **유연한 확장성**: 기본 제공 기능뿐만 아니라, 프로젝트 요구사항에 맞게 세부적인 커스터마이징이 가능합니다.

✅ **강력한 보안 기능**: 인증, 권한 부여, 요청률 제한 기능이 내장되어 있어, 보안성이 높은 API를 구축할 수 있습니다.

✅ **브라우저블 API**: DRF는 개발자가 API를 쉽게 테스트하고 문서화할 수 있도록, 브라우저에서 직접 상호작용할 수 있는 인터페이스를 제공합니다.

DRF를 활용하면 Django 기반 프로젝트에서 RESTful API를 더욱 빠르고 효율적으로 구축할 수 있습니다!

- **DRF** 에 대해 더 궁금하시다면?
    
    [04. Django REST 프레임워크: 전문가처럼 API 구축](https://wikidocs.net/197558)
    

# 1️⃣ 사전 준비 및 오류 해결

**본격적인 API 연결 코드를 작성하기 전에 연습을 진행해봅시다!**

<aside>
⚠️ **주의사항 : 프론트(React), 백 (django) 서버 모두 켜놓기**

**** 에러화면 나오면 정상이에요 **** 
프론트 - 백 연결 전 세팅해줘야 할 사항들을 아직 해결하지 않아서 에러가 나는 것입니다.

</aside>

<aside>
📢 **[도움말] 터미널을 2개 켜놓고 프론트, 백 서버를 각각 켜놓은 다음 전환하면서 진행하면 편합니다.**

</aside>

## 환경 세팅

1. **git clone 받아주세요!! (Not required but highly Recommended!!)**

추천 방식 : 멋사 자료 모아놓는 폴더에 deploy라는 폴더를 만든다. 그리고 vscode로 해당 폴더를 연 다음 아래의 명령어를 입력한다.

https://github.com/SNULION-14th/deploy-django-seminar.git

https://github.com/SNULION-14th/deploy-react-seminar.git

```python
git clone https://github.com/SNULION-14th/deploy-django-seminar.git
git clone https://github.com/SNULION-14th/deploy-react-seminar.git
```

→ 이렇게 하면 `deploy` 폴더 안에 아래와 같이 두 개의 폴더가 생깁니다:

```python
deploy/
├── deploy-django-seminar/   ← 백엔드 (Django)
└── deploy-react-seminar/    ← 프론트엔드 (React)
```

**VSCode로** 각 폴더를 **루트 디렉토리**로 열어야 해요:

- VSCode에서 `deploy-django-seminar` 폴더 열기 → 백엔드 개발용
- VSCode에서 `deploy-react-seminar` 폴더 열기 → 프론트 개발용

> ❗주의: VSCode에서 전체 deploy 폴더를 여는 게 아니라,
> 
> 
> 각각 **React / Django 폴더를 독립적으로 열어야** 프로젝트 설정이 정확히 적용됩니다.
> 

앞으로 두개의 vscode를 번갈아 가면서 할 거기 때문에 헷갈리지 마시고 잘 따라오세요~

### 장고 세미나부터!

1. **가상환경 세팅 및 패키지 다운 (uv 안쓰는 버전)**

```python
# 가상 환경 생성 (Windows)
python -m venv .venv

# Windows에서 터미널이 cmd라면
.venv\Scripts\activate.bat

# Windows에서 터미널이 git bash라면
source .venv/Scripts/activate

# Mac OS
python3 -m venv .venv
source .venv/bin/activate

# 패키지 다운
pip install -r requirements.txt

#브랜치 생성
git checkout -b week10-[이름]
ex. git checkout -b week10-lion
```

1. **가상환경 세팅 및 패키지 다운 (uv 쓰는 버전)**
- uv 설치 명령어
    
    ```yaml
    # uv 설치 (안했다면)
    pip install uv
    
    # uv 설치 MAC용 (안했다면)
    brew install uv
    ```
    

```yaml
# uv 프로젝트 초기화 (python version 3.12 고정)
uv init --python 3.12

# requirements.txt에 있는 패키지들을 uv 프로젝트 의존성으로 추가
# 이때 알아서 .venv라는 이름의 가상환경을 uv가 만들어줌
uv add -r requirements.txt

# 가상환경 생성 및 lockfile 기준 설치
uv sync

# Windows에서 터미널이 cmd라면
.venv\Scripts\activate.bat

# Windows에서 터미널이 git bash라면
source .venv/Scripts/activate

# Mac OS
source .venv/bin/activate

#브랜치 생성
git checkout -b week10-[이름]
ex. git checkout -b week10-lion
```

1. **장고 키 세팅**

[Djecrety](https://djecrety.ir/)

- django key 복사
- **.env 파일을 root directory에 만들고 아래처럼 key 붙여넣기**

```python
# .env
SECRET_KEY='자기 장고 키'
```

1. **DB Migration & `superuser` 생성!**

```python
# Terminal

python manage.py migrate

python manage.py createsuperuser
python manage.py runserver
```

1. [**http://localhost:8000/api/post](http://localhost:8000/api/post) : 접속**

![KakaoTalk_Photo_2023-05-19-21-29-52.png](attachment:5cf26db5-80f6-4c9b-a5fd-9ba6993380b9:KakaoTalk_Photo_2023-05-19-21-29-52.png)

`Error?`

**1. ( `INSTALLED_APPS` ) - `seminar/settings` 수정** 

**seminar/settings.py (django)**

```python
# seminar/settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
		**'rest_framework', ## 추가** 
    'rest_framework_simplejwt', ## 추가
    'drf_spectacular',
    'post',
    'account',
    'tag',
    'comment',
    'rest_framework_simplejwt.token_blacklist',
]
```

1. **admin.py 수정**

Django admin Page 이용하기 위한 준비

**post/admin.py (django)**

```python
from django.contrib import admin

### 아래 추가 ###
from .models import Like, Post

admin.site.register(Post)
admin.site.register(Like)
```

**Tag/admin.py (django)**

```python
from django.contrib import admin

# Register your models here.
### 아래 추가 ###
from .models import Tag

admin.site.register(Tag)
```

**Comment/admin.py (django)**

```python
from django.contrib import admin

# Register your models here.
### 아래 추가 ###
from .models import Comment

admin.site.register(Comment)
```

1. **settings.py 수정**

Token 인증 이용하기 위한 준비

**seminar/settings.py**

```python
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.AllowAny",),
    "DEFAULT_AUTHENTICATION_CLASSES": (
            ### 아래 꺼 추가"
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}
```

1. **테스트용 `post` 를 하나 만들어봅시다**

**superuser로 admin 페이지에 접근**해서 **“첫번째 포스트”**라는 내용으로 `post` 를 하나 만들어주세요!! (서버 키기!!)

```python
#terminal#
python manage.py runserver
```

http://localhost:8000/admin/ 로 들어가서 Post add

```python
title: "첫번째 포스트",
content: "첫번째 포스트",
author: "자기 admin 이름"
```

**본격적으로 백엔드 API를 프론트와 연결해줍시다!!** 

## HomePage에 posts 불러오기

<aside>
⚠️ **프론트(React) 서버로 이동해주세요**

</aside>

1. **Axios 설치** 

```jsx
// Terminal

git checkout -b week10-[이름]

npm install axios
npm start
```

`package.json` 에 `axios` 추가된 모습을 확인할 수 있죠?

1. **[HomPage.jsx] axios 불러와서 `/api/post/` 에 요청을 보내고 콘솔에 데이터를 출력하는 함수 생성** 

```jsx
// src/routes/HomePage.jsx
import { useState, useEffect } from "react";
import { SmallPost } from "../components/Posts";
import { Link } from "react-router-dom";
import posts from "../data/posts";
##추가##
**import axios from "axios";**

const HomePage = () => {
 useEffect(() => {
****###추가
    **const getPostAPI = async () => {
      const response = await axios.get("http://localhost:8000/api/post/");
      console.log(response);
    }
    getPostAPI();**

    const tagList = posts.reduce((acc, post) => {
      for (let tag of post.tags) {
        acc.add(tag.content);
      }
      return acc;
    }, new Set());
    setTags([...tagList]);
    setSearchTags([...tagList]);
  }, []);
	...
```

1.  http://localhost:3000/ 에서 **콘솔 확인해볼까요?!**
    
    ![image.png](attachment:4be1ae24-731a-400a-93d2-1e245a9d3147:image.png)
    
    ![image.png](attachment:1b426311-9815-4b7a-9063-c09407f91de8:image.png)
    

```bash
Access to XMLHttpRequest at 'http://localhost:8000/api/post/' from origin '[http://localhost:3000](http://localhost:3000/)' **has been blocked by CORS policy**: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**⇒ 🚨 !!!!!!!!! `CORS` 에러!!!!!!! 🚨**

### **CORS란?**

![](https://enshrined-couch-1f4.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Fef419962-eba4-4e9c-b70d-e6b09925fa85%2Fde536758-a4ab-4a52-b3f1-a7b891eeedfe%2Fcors.png?table=block&id=98934816-66a8-4f4e-af77-4901e787342f&spaceId=ef419962-eba4-4e9c-b70d-e6b09925fa85&width=1420&userId=&cache=v2)

CORS는 Cross-Origin Resource Sharing이라는 의미로,

간단하게 설명하자면 단어 그대로 **다른 출처의 리소스 공유에 대한 허용/비허용 정책 입니다.**

웹에서 HTTP 프로토콜을 이용하여 서버에 요청을 보낼때, 브라우저는 **요청 헤더에 Origin 이라는 필드에 출처**를 함께 담아 보내게 됩니다. 서버가 이 요청에 대한 응답을 할 때 **응답 헤더에 Access-Control-Allow-Origin이라는 필드**를 추가하고 값으로 '**이 리소스를 접근하는 것이 허용된 출처 url**'을 내려보냅니다. 

이후 응답을 받은 브라우저는 자신이 보냈던 **요청의 Origin과** 서버가 보내준 **응답의 Access-Control-Allow-Origin을 비교**해본 후 차단할지 말지를 결정합니다.  즉, **CORS는 특정 서버가 다른 컴퓨터/서버랑 통신을 못하게끔 막아버리는 것**이에요 (브라우저가 통제)
- 프론트와 백은 서로 다른 별개의 서버니까, 통신을 못하겠죠? ⇒ CORS 에러!!

(**흥선대원군이 서양 문화를 극도로 배척**한 것처럼…? **브라우저는** 굉장히 보수적이라 **다른 서버와의 연결을 전부 막아버립니다!!**)

![](https://enshrined-couch-1f4.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Fef419962-eba4-4e9c-b70d-e6b09925fa85%2F0227ec31-3eaa-4058-beec-3f16bd76efe9%2FUntitled.png?table=block&id=ec055b0b-cc2f-4100-8f1b-e02cacb6edbb&spaceId=ef419962-eba4-4e9c-b70d-e6b09925fa85&width=770&userId=&cache=v2)

자세한 설명을 원한다면?

### **CORS 문제 해결 - django-cors-headers**

**각 프레임워크마다 CORS를 쉽게 해결해주는 기능들**이 있어요

**장고에서는 django-cors-headers 패키지**를 사용합니다.

[django-cors-headers](https://pypi.org/project/django-cors-headers/)

[](https://enshrined-couch-1f4.notion.site/image/https%3A%2F%2Fpypi.org%2Fstatic%2Fimages%2Ffavicon.35549fe8.ico?table=block&id=bf1cb941-5523-4f40-b33a-4fbb8c559c7a&spaceId=ef419962-eba4-4e9c-b70d-e6b09925fa85&userId=&cache=v2)

### 다시 백엔드 서버로 돌아와서

```bash
# Terminal

pip install django-cors-headers
pip freeze > requirements.txt

# uv 쓰는 사람의 경우

uv add django-cors-headers
uv pip freeze > requirements.txt
```

**(수정)seminar/settings.py (django)**

```python
INSTALLED_APPS = [
    ...,
    **"corsheaders",**
    ...,
]

MIDDLEWARE = [
    ...,
    **"corsheaders.middleware.CorsMiddleware", ##추가**
    ...,
]

### 아래 전체 추가 ###
**CORS_ALLOWED_ORIGINS= [ # (헤더) Access-Control-Allow-Origin 에 담을 주소들
  'http://127.0.0.1:3000', 
  'http://localhost:3000',
]
#CORS_ALLOW_CREDENTIALS = True # cookie를 주고받으려면 얘를 True로 설정해야 해요.
CORS_ALLOW_HEADERS = (
    "accept",
    "authorization",
    "content-type",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
)**
```

⇒ CORS 관련 세팅 완료!!

- **다시 axios 호출 해봅시다**
    
    python [manage.py](http://manage.py) runserver  → 백엔드 서버 키고
    
    npm start → 프론트엔드 서버도 켜 있는 상태에서
    
    http://localhost:3000/ 로 가서 콘솔 보면 
    
    **!!!! 🔥 성공 🔥 !!!!**
    
    ![Untitled](attachment:0c5af0d4-ffdc-40e8-a847-8eed4f267270:Untitled.png)
    
    `{data: Array(1), status: 200, statusText: 'OK', headers: AxiosHeaders, config: {…}, …}`
    
    우리가 미리 만들어놓은 post를 잘 불러오고 있습니다~!
    
    <aside>
    💡 **CORS가 정말 해결된 것일까?**
    
    </aside>
    
    **개발자도구 `네트워크` 창 확인**
    
    post/ 클릭해서 헤더 보시면
    
    ![Untitled](attachment:6e03c128-1719-4cfc-8634-cb5bd3c26313:Untitled.png)
    
    우리가 세팅한대로 **`Access-Control-Allow-Origin` 에 프론트의 주소 `http:localhost:3000`** 이 담겨있네요!! 
    

(정리~) 잘 되는 것 확인했으니 다시 프론트 코드는 지워주세요!

**(수정) src/routes/HomePage.jsx (React)**

```jsx
...
**~~import axios from "axios";~~**

const HomePage = () => {
 **** useEffect( () => {
      **~~const getPostAPI = async () => {
        const response = await axios.get("http://localhost:8000/api/post/");
        console.log(response);
      }
      getPostAPI();
  }, []);~~**
	...
```

## 회원가입 (SignUp)

<aside>
⚠️ **주의사항 : 비밀번호 생성 시**
1. 숫자로만 하면 안돼요
2. 8글자 이상으로 설정해야 해요

</aside>

**회원가입을 시도해볼게요**

1. **`api/signup` 요청하고 response 콘솔에 찍는 함수 만들기**
- 이전에 만들어놨던 **`formData`** 를 백엔드 쪽에 전달해줘야 해요
- 우리는 `username` , `password` 담아 보낼거니까
헤더에 **`Content-Type`** 을 적어줘야 해요! (`json` 형식으로 지정하겠습니다.)

**(수정) src/routes/SignUpPage.jsx (React)**

```jsx
**### 추가 ###
import axios from "axios";**

### 아예 이걸로 복붙 ####
  const handleSignUpSubmit = async (e) => {
    e.preventDefault(); // 페이지 새로고침 방지

    console.log("signUpData:", JSON.stringify(signUpData, null, 2));

    try {
      const response = await axios.post(
        "http://localhost:8000/api/account/signup/",
        signUpData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Signup Success:", response.data);
    } catch (error) {
      if (error.response) {
        // 서버에서 응답을 반환한 경우 (400, 500 등)
        console.log("Error Response:", error.response.data);
        alert(`Signup failed: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // 요청을 보냈지만 응답이 없는 경우
        console.log("No Response from Server");
        alert("No response from server. Please try again.");
      } else {
        // 기타 예외
        console.log("Request Error:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };
```

- **이제, 회원가입을 시도해볼까요?!**
    
    npm start 후  http://localhost:3000/
    
    콘솔에 잘 찍히면 성공!
    
    ![image.png](attachment:9f1a716f-d1ce-4541-b641-58d64353acd1:image.png)
    
- **그럼 회원가입 성공일까요?**
    
    http://localhost:8000/admin/auth/user/ ****
    
    **유저가 잘 생성되었나 확인하러 가보죠 (장고 관리자 페이지)**
    
    ![Untitled](attachment:ad65d968-6c53-4397-b241-fd7c80c1391f:Untitled.png)
    
    `test` 유저가 정상적으로 생성이 되었어요! 
    
    - 🚨 **근데 한 가지 치명적인 문제가 있어요! 뭐가 문제일까요?** 🚨
        
        **⇒ 🍪 `쿠키(Cookie)` 🍪  가 비어있어요,,, 😵‍💫**
        
        **쿠키를 한번 살펴볼까요?** 
        
        `개발자도구 > 애플리케이션 > 쿠키`
        
        ![Untitled](attachment:7ba55404-c97c-48cd-b7cc-a7ebbcbed7bd:Untitled.png)
        
        ⇒ 회원가입을 시도했지만, **쿠키에는 `access_token` `refresh_token` 이 없어요,, ㅠ**
        
        백엔드에서 회원가입, 로그인을 어떻게 처리했었는지 한번 더 살펴볼게요. 
        
        **(기존) account/views.py (Django)**
        
        **`SignupView`**
        
        ```python
        class SignUpView(APIView):
            @swagger_auto_schema(
                operation_id="회원가입",
                operation_description="회원가입을 진행합니다.",
                request_body=SignUpRequestSerializer,
                responses={201: UserProfileSerializer, 400: "Bad Request"},
            )
            def post(self, request):
        
                user_serializer = UserSerializer(data=request.data)
                if user_serializer.is_valid(raise_exception=True):
                    user_serializer.validated_data["password"] = make_password(
                        user_serializer.validated_data["password"]
                    )
                    user = user_serializer.save()
                    user.save()
        
                college = request.data.get("college")
                major = request.data.get("major")
        
                UserProfile.objects.create(user=user, college=college, major=major)
                **return set_token_on_response_cookie(user, status_code=status.HTTP_201_CREATED)**
        ```
        
        **`set_token_on_response_cookie`**
        
        ```python
        def set_token_on_response_cookie(user, status_code) -> Response:
        
            token = RefreshToken.for_user(user)
            user_profile = UserProfile.objects.get(user=user)
            serialized_data = UserProfileSerializer(user_profile).data
            res = Response(serialized_data, status=status_code)
            **res.set_cookie('refresh_token', value=str(token), httponly=True)
            res.set_cookie('access_token', value=str(token.access_token), httponly=True)**
            return res
        ```
        
        우리는 회원가입, 로그인 시에 프론트의 쿠키에 토큰을 넣어주려고 했어요.
        
        즉, 정상적으로 작동했다면 **브라우저의 쿠키에 `access_token` , `refresh_token` 이 담겨있어야** 합니다! 
        
        ⇒ **이제, 어떻게 쿠키에 토큰을 넣을 수 있을지 고민해야겠죠?!**
        

1. **백엔드에서 프론트의 쿠키에 정보를 넣어줄 수 있게 세팅해줍시다**

### `httponly` 옵션 해제

`httponly` 옵션을 해제해줘야, 프론트엔드에서 브라우저 쿠키에 접근할 수 있어요! 지워줍시다

### 백엔드 코드로 오세요~

**(수정) account/views.py (Django)**

```python
def set_token_on_response_cookie(user, status_code) -> Response:

    token = RefreshToken.for_user(user)
    user_profile = UserProfile.objects.get(user=user)
    serialized_data = UserProfileSerializer(user_profile).data
    res = Response(serialized_data, status=status_code)
    res.set_cookie('refresh_token', value=str(token), **~~httponly=True~~**)
    res.set_cookie('access_token', value=str(token.access_token), **~~httponly=True~~**)
    return res

class TokenRefreshView(APIView):
    @swagger_auto_schema(
        operation_id="토큰 재발급",
        operation_description="access 토큰을 재발급 받습니다.",
        request_body=TokenRefreshRequestSerializer,
        responses={200: UserProfileSerializer},
    )
    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"detail": "no refresh token"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            RefreshToken(refresh_token).verify()
        except:
            return Response(
                {"detail": "please signin again."}, status=status.HTTP_401_UNAUTHORIZED
            )
        new_access_token = str(RefreshToken(refresh_token).access_token)
        response = Response({"detail": "token refreshed"}, status=status.HTTP_200_OK)
        response.set_cookie("access_token", value=str(new_access_token), **~~httponly=True~~**)
        return response
```

> HttpOnly 옵션이 켜져 있으면, 브라우저의 자바스크립트(document.cookie)로 쿠키에 접근할 수 없게 막혀요.
> 
> 
> 그러니까 **프론트엔드가 쿠키를 직접 다루려면, 이 옵션을 꺼야 합니다.**
> 

이걸 조금 더 자세히 설명해볼게요.

---

## 🔐 `HttpOnly` 옵션이 하는 일

`HttpOnly`는 쿠키를 다음과 같이 설정할 수 있는 **보안 옵션**입니다:

```
Set-Cookie: access_token=abc123; HttpOnly;
```

이렇게 되면:

- ✅ **서버가 응답할 때 브라우저는 쿠키를 저장하고**
- ✅ **서버에 요청할 때는 자동으로 쿠키를 포함해서 보냄**
- ❌ **하지만 자바스크립트에서는 `document.cookie`로 읽을 수 없음**

> 즉, 브라우저에 "이 쿠키는 서버 전용이야. 클라이언트 JS는 접근하지 마!" 라고 알려주는 거예요.
> 

---

## 🧑‍💻 그래서 프론트엔드에서 못 쓰는 이유는?

프론트에서 `document.cookie`를 써서 쿠키를 읽으려면…

```
console.log(document.cookie); // → HttpOnly 쿠키는 출력 안 됨
```

**`HttpOnly`가 설정된 쿠키는 이 API에서 아예 안 보여요.**

즉, **프론트 자바스크립트 입장에서 "존재 자체를 모르는 것처럼" 동작**합니다.

---

## ✅ 그래서 `HttpOnly`를 **꺼야** 할 때는?

프론트가 쿠키를 다뤄야 할 때예요. 예를 들어:

- 로그인 토큰을 쿠키에 저장해놓고 프론트에서 직접 꺼내 `fetch()`에 붙이고 싶을 때
- 유저 설정값을 쿠키에서 직접 읽어야 할 때

이럴 땐 쿠키를 **`HttpOnly` 없이 설정해야** 자바스크립트에서 접근할 수 있어요:

```
Set-Cookie: theme=dark; Path=/;  // HttpOnly 없음!
```

---

## ⚠️ 하지만 보안상 주의!

- 중요한 정보(예: **액세스 토큰**, **세션 ID**)는 절대로 HttpOnly를 꺼두면 안 돼요.
- XSS 공격으로 자바스크립트가 실행되면, `document.cookie`로 쿠키를 탈취할 수 있으니까요.

---

### `CREDENTIAL` - 쿠키 주고 받기로 미리 약속

**`credential` 을 `True` 로 해줘야, 프론트와 백이 서로 쿠키를 주고받을 수 있어요!!** 

위에서 봤던 **`Access-Control-Allow-Credentials`** 의 정체가 뭔지 알겠죠?!

![response header.png](attachment:f429c351-0690-4969-a401-a49fe24f647c:response_header.png)

---

- **withCredentials에 대한 더 자세한 설명은?**
    
    `withCredentials`와 `CORS_ALLOW_CREDENTIALS`는 웹 개발에서 크로스-오리진 요청을 다룰 때 사용되는데, 이 둘은 서로 관련이 있으며 사용자 인증 정보를 포함한 요청을 어떻게 처리할지를 결정합니다.
    
    ### withCredentials
    
    `withCredentials`는 웹 브라우저가 다른 도메인으로 요청을 보낼 때, 그 요청에 사용자의 인증 정보(쿠키, 로그인 세션 등)를 포함할지를 결정하는 설정입니다. 기본적으로, 웹 브라우저는 보안을 위해 다른 도메인으로의 요청에 이러한 정보를 포함하지 않습니다. 하지만, `withCredentials`를 `true`로 설정하면, 요청과 함께 사용자의 인증 정보를 보낼 수 있게 되어, 사용자가 로그인한 상태를 유지할 수 있게 도와줍니다.
    
    ### CORS_ALLOW_CREDENTIALS
    
    서버 측에서는 `CORS_ALLOW_CREDENTIALS` 설정을 통해, 다른 도메인에서 오는 요청이 사용자의 인증 정보를 포함해도 되는지를 결정합니다. 이 설정이 `True`로 되어 있으면, 서버는 인증 정보를 포함한 크로스-오리진 요청을 허용하게 됩니다. 즉, 서버는 이 설정을 통해, 다른 도메인의 웹 페이지에서 사용자가 자신에게 인증 정보와 함께 요청을 보내도 그 요청을 정상적으로 처리하겠다고 약속하는 것입니다.
    
    ### 상호작용
    
    - 만약 클라이언트 측에서 `withCredentials`를 `true`로 설정했지만, 서버 측에서 `CORS_ALLOW_CREDENTIALS`를 `True`로 설정하지 않았다면, 브라우저는 보안을 위해 서버로부터 온 응답을 차단하게 됩니다.
    - 반대로, `CORS_ALLOW_CREDENTIALS`가 `True`이지만 클라이언트 측에서 `withCredentials`를 사용하지 않거나 `false`로 설정했다면, 사용자의 인증 정보는 요청과 함께 전송되지 않습니다.
    
    이 두 설정은 웹 애플리케이션에서 사용자의 인증 상태를 유지하면서도 보안을 유지하기 위해 중요하게 사용됩니다.
    

**⇒ 백엔드 CORS 세팅 주석 해제 합시다**

**(수정) seminar/settings.py (Django)**

```python
CORS_ALLOWED_ORIGINS= [
  'http://127.0.0.1:3000', 
  'http://localhost:3000',
]
# ------ 주석해제 ------
**CORS_ALLOW_CREDENTIALS = True # cookie를 주고받으려면 얘를 True로 설정해야 해요.**
# --------------------
CORS_ALLOW_HEADERS = (
    "accept",
    "authorization",
    "content-type",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
)

```

**프론트 요청 header에 `withCredentials=true` 를 추가합시다**

**(수정) src/routes/SignUpPage.jsx** **(React)** 

아예 handleSignUpSubmit 에 복붙하자. 

```java
  const handleSignUpSubmit = async (e) => {
    e.preventDefault(); // to prevent reloading the page
    const response = await axios.post(
      "http://localhost:8000/api/account/signup/",
      signUpData,
      {
        headers: {
          "Content-Type": "application/json",
        },
	      **withCredentials: true** 
      }
    );
    console.log(response);    
  };
```

⇒ **이제 쿠키에 토큰이 들어올 수 있어요!**

아까 만들었던 **유저를 지우고, 다시 회원가입**을 해볼게요!