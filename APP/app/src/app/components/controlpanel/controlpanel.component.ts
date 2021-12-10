import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-controlpanel',
	templateUrl: './controlpanel.component.html',
	styleUrls: ['./controlpanel.component.scss']
})
export class ControlpanelComponent implements OnInit {

	variableForm: FormGroup;
	linComb: string;

	constructor(private formBuilder: FormBuilder) {

		this.variableForm = this.formBuilder.group({
			terms: this.formBuilder.array([]),
		});

		this.linComb = '';
	}

	rankTerms(): FormArray {
		return this.variableForm.get("terms") as FormArray
	}

	newTerm(): FormGroup {
		return this.formBuilder.group({
			varName: '<Specify Type>',
			weight: '1'
		})
	}

	addTerm() {
		if (this.rankTerms().length < 4) {
			this.rankTerms().push(this.newTerm());
			this.updateEquation();
		}
	}

	removeTerm(i: number) {
		this.rankTerms().removeAt(i);
		this.updateEquation();
	}

	updateEquation() {
		let termArray = this.rankTerms();
		let vars: string[] = [];
		if (termArray.length > 0) {
			termArray.controls.forEach(term => {
				let mystr = term.get("weight")?.value + ' * ' + term.get("varName")?.value;
				vars.push(mystr);
			});

		}
		this.linComb = vars.join(' + ');
	}

	onSubmit() {
		console.log(this.variableForm.value);
	}

	ngOnInit(): void {
	}

}
