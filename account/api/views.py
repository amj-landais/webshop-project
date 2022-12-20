from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth.models import User
from account.api.serializers import RegisterUserSerializer, UserSerializer, PasswordChangeSerializer
from rest_framework.response import Response
from rest_framework.authtoken.models import Token


class RegisterUserAPI(APIView):
    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        user = User.objects.create_user(username=data["username"], email=data["email"],
                                        password=data["password"])

        # the user is automatically saved by the function create_user()

        Token.objects.create(user=user)  # create a new token for the user

        user_serializer = UserSerializer(user)  # in order to have a comprehensible response

        return Response(user_serializer.data)


class PasswordAPI(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        response = Response({"message": "Password changed successfully."})

        #  verify that the old password is the right one
        user = Token.objects.get(key=data["token"]).user

        if not user.check_password(data["old_password"]):
            response = Response({"message": "Wrong old password"}, status=500)

        else:
            # change password
            user.set_password(data["new_password"])
            user.save()

        return response



