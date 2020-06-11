// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/auth")
public class AuthServlet extends HttpServlet {

  private final static String LOGOUT_REDIRECT_URL = "/";
  private final static String LOGIN_REDIRECT_URL = "/";

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");

    UserService userService = UserServiceFactory.getUserService();
    if (userService.isUserLoggedIn()) {
      String userEmail = userService.getCurrentUser().getEmail();
      String logoutUrl = userService.createLogoutURL(LOGOUT_REDIRECT_URL);
      
      List<String> user = new ArrayList<String>();
      user.add("loggedIn");
      user.add(logoutUrl);
      user.add(userEmail);
      Gson gson = new Gson();
      String json = gson.toJson(user);

      response.getWriter().println(json);

    } else {
      String loginUrl = userService.createLoginURL(LOGIN_REDIRECT_URL);
      
      List<String> user = new ArrayList<String>();
      user.add("loggedOut");
      user.add(loginUrl);
      Gson gson = new Gson();
      String json = gson.toJson(user);

      response.getWriter().println(json);
    }
  }
}
