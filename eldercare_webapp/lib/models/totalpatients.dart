import 'package:eldercare_webapp/constants.dart';
import 'package:flutter/material.dart';

class CloudStorageInfo {
  final String?  title, range,totalStorage;
  final int? numOfFiles, percentage;
  final Color? color;

  CloudStorageInfo({
    this.totalStorage,
    this.title,
    this.range,
    this.numOfFiles,
    this.percentage,
    this.color,
  });
}

List demoMyFiles = [
  CloudStorageInfo(
    title: "Young old",
    range: "60-69 years",
    numOfFiles: 1328,
    totalStorage: "102",
    color: Color.fromRGBO(173, 255, 201, 2),
    percentage: 35,
  ),
  CloudStorageInfo(
    title: "Middle old",
    range: "70-79 years",
    numOfFiles: 1328,
    totalStorage: "84",
    color: Color.fromRGBO(247, 214, 161, 2),
    percentage: 35,
  ),
  CloudStorageInfo(
    title: "Very old",
    range: ">= 80 years ",
    numOfFiles: 1328,
    totalStorage: "52",
    color: Color.fromRGBO(226, 172, 181, 2),
    percentage: 10,
  ),
  
];