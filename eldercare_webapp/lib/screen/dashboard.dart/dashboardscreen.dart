import 'package:eldercare_webapp/constants.dart';
import 'package:eldercare_webapp/responsive.dart';
import 'package:eldercare_webapp/screen/dashboard.dart/component/Barchart.dart';

import 'package:eldercare_webapp/screen/dashboard.dart/component/PatientList.dart';
import 'package:eldercare_webapp/screen/dashboard.dart/component/header.dart';
import 'package:eldercare_webapp/screen/dashboard.dart/component/total_patients.dart';
import 'package:flutter/material.dart';

class DashboardScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final patients = [
      Patient(id: '01', name: 'Rupert Wesley', gender: 'Male', age: 65),
      Patient(id: '02', name: 'Marry Stuart', gender: 'Female', age: 74),
      Patient(id: '03', name: 'Harold Thompson', gender: 'Male', age: 72),
      Patient(id: '04', name: 'Lin Chen', gender: 'Female', age: 68),
      Patient(id: '05', name: 'Lin Chen', gender: 'Female', age: 68),
      Patient(id: '06', name: 'Lin Chen', gender: 'Female', age: 68),
      Patient(id: '07', name: 'Lin Chen', gender: 'Female', age: 68),
      Patient(id: '08', name: 'Lin Chen', gender: 'Female', age: 68),
      Patient(id: '09', name: 'Lin Chen', gender: 'Female', age: 68),
      Patient(id: '10', name: 'Lin Chen', gender: 'Female', age: 68),

    ];
    return SafeArea(
      child: SingleChildScrollView(
        primary: false,
        padding: EdgeInsets.all(defaultPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Header(),
            SizedBox(
              height: defaultPadding,
            ),
            Row(
              children: [
                Expanded(
                  flex: 5,
                  child: Container(
                    padding: EdgeInsets.all(defaultPadding),
                    height: 400,
                    decoration: BoxDecoration(
                      color: secondaryColor,
                      borderRadius: const BorderRadius.all(Radius.circular(20)),
                    ),
                    child: Column(
                      children: [
                        totalpatients(),
                        SizedBox(height: defaultPadding),
                        if (Responsive.isMobile(context))
                          SizedBox(height: defaultPadding),
                        if (Responsive.isMobile(context))
                         SizedBox(height: defaultPadding),
                      ],
                    ),
                  ),
                ),
                if (!Responsive.isMobile(context))
                  SizedBox(width: defaultPadding),
                // On Mobile means if the screen is less than 850 we don't want to show it
                if (!Responsive.isMobile(context))
                  SizedBox(width: defaultPadding),
                Expanded(
                  flex: 5,
                  child: Container(
                    padding: EdgeInsets.all(defaultPadding),
                    height: 400,
                    decoration: BoxDecoration(
                      color: secondaryColor,
                      borderRadius: const BorderRadius.all(Radius.circular(20)),
                    ),
                    child: Flexible(
                      child: Column(children: [
                        Text(
                          "Patients",
                          style: TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        SingleChildScrollView(
                          child: Container(
                            padding: EdgeInsets.all(defaultPadding),
                            height: 300,
                            child: PatientTable(patients: patients),
                          ),
                        )
                      ]),
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(
              height: defaultPadding,
            ),
            Row(
              children: [
                Expanded(
                  flex: 2,
                  child: Container(
                    padding: EdgeInsets.all(defaultPadding),
                    height: 400,
                    decoration: BoxDecoration(
                      color: secondaryColor,
                      borderRadius: const BorderRadius.all(Radius.circular(20)),
                    ),
                    child: Flexible(
                      child: Column(children: [
                        Text(
                          "Transition Time",
                          style: TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        SingleChildScrollView(
                          child: Container(
                            padding: EdgeInsets.all(defaultPadding),
                            height: 300,
                            child: TransitionBarChart.withSampleData(),
                          ),
                        )
                      ]),
                    ),
                  ),
                ),
                 if (!Responsive.isMobile(context))
                  SizedBox(width: defaultPadding),
                // On Mobile means if the screen is less than 850 we don't want to show it
                if (!Responsive.isMobile(context))
                  SizedBox(width: defaultPadding),
                Expanded(
                  flex: 2,
                  child: Container(
                    padding: EdgeInsets.all(defaultPadding),
                    height: 400,
                    decoration: BoxDecoration(
                      color: secondaryColor,
                      borderRadius: const BorderRadius.all(Radius.circular(20)),
                    ),
                    child: Flexible(
                      child: Column(children: [
                        Text(
                          "Sitting Time",
                          style: TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        SingleChildScrollView(
                          child: Container(
                            padding: EdgeInsets.all(defaultPadding),
                            height: 300,
                            child: SitBarChart.withSampleData(),
                          ),
                        )
                      ]),
                    ),
                  ),
                ),
                 if (!Responsive.isMobile(context))
                  SizedBox(width: defaultPadding),
                // On Mobile means if the screen is less than 850 we don't want to show it
                if (!Responsive.isMobile(context))
                  SizedBox(width: defaultPadding),
                Expanded(
                  flex: 2,
                  child: Container(
                    padding: EdgeInsets.all(defaultPadding),
                    height: 400,
                    decoration: BoxDecoration(
                      color: secondaryColor,
                      borderRadius: const BorderRadius.all(Radius.circular(20)),
                    ),
                     child: Flexible(
                      child: Column(children: [
                        Text(
                          "Sleeping Time",
                          style: TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        SingleChildScrollView(
                          child: Container(
                            padding: EdgeInsets.all(defaultPadding),
                            height: 300,
                            child: SleepBarChart.withSampleData(),
                          ),
                        )
                      ]),
                    ),
                  ),
                ),
                 if (!Responsive.isMobile(context))
                  SizedBox(width: defaultPadding),
                // On Mobile means if the screen is less than 850 we don't want to show it
                if (!Responsive.isMobile(context))
                  SizedBox(width: defaultPadding),
                Expanded(
                  flex: 2,
                  child: Container(
                    padding: EdgeInsets.all(defaultPadding),
                    height: 400,
                    decoration: BoxDecoration(
                      color: secondaryColor,
                      borderRadius: const BorderRadius.all(Radius.circular(20)),
                    ),
                    child: Flexible(
                      child: Column(children: [
                        Text(
                          "Standing Time",
                          style: TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        SingleChildScrollView(
                          child: Container(
                            padding: EdgeInsets.all(defaultPadding),
                            height: 300,
                            child: StandBarChart.withSampleData(),
                          ),
                        )
                      ]),
                    ),
                  ),
                ),
                
                ]
            )
          ],
        ),

      ),
    );
  }
}
