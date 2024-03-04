import 'package:eldercare_webapp/constants.dart';
import 'package:eldercare_webapp/controllers/MenuAppController.dart';
import 'package:eldercare_webapp/screen/main/screen_main.dart';
import 'package:english_words/english_words.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:eldercare_webapp/screen/main/screen_main.dart';


void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
        title: 'Eldercare Monitoring System',
        theme: ThemeData.dark().copyWith(
          scaffoldBackgroundColor: bgColor,
          textTheme: GoogleFonts.poppinsTextTheme(Theme.of(context).textTheme)
          .apply(bodyColor: primaryColor),
          canvasColor: secondaryColor,
          ),
          
        
         home: MultiProvider(
        providers: [
          ChangeNotifierProvider(
            create: (context) => MenuAppController(),
          ),
        ],
        child: Dashboard(),
      ),
    );
  }
}

