import 'package:flutter/material.dart';

class Patient {
  final String id;
  final String name;
  final String gender;
  final int age;

  Patient({required this.id, required this.name, required this.gender, required this.age});
}

class PatientTable extends StatelessWidget {
  final List<Patient> patients;
  

  PatientTable({required this.patients});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.vertical,
      
        child: DataTable(
          columns: [
            DataColumn(label: Text('#')),
            DataColumn(label: Text('Name')),
            DataColumn(label: Text('Gender')),
            DataColumn(label: Text('Age')),
          ],
          rows: patients.map((patient) => DataRow(
            cells: [
              DataCell(Text(patient.id)),
              DataCell(Text(patient.name)),
              DataCell(Text(patient.gender)),
              DataCell(Text(patient.age.toString())),
            ],
          )).toList(),
        ),
      
    );
  }
}

class PatientRow extends StatelessWidget {
  final Patient patient;

  PatientRow({required this.patient});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(patient.name),
      leading: Text(patient.id),
      trailing: Text(patient.gender),
      subtitle: Text(patient.age.toString()),
    );
  }
}