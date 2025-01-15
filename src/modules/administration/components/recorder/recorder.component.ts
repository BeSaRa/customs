import { Component, inject, OnInit, output, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  AudioConfig,
  AutoDetectSourceLanguageConfig,
  ResultReason,
  SpeechConfig,
  SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk';
import { take } from 'rxjs';
import { MatTooltip } from '@angular/material/tooltip';
import { AppStore } from '@stores/app.store';
import { LangService } from '@services/lang.service';
import { SpeechService } from '@services/speech.service';

@Component({
  selector: 'app-recorder',
  standalone: true,
  imports: [NgClass, MatTooltip],
  templateUrl: './recorder.component.html',
  styleUrl: './recorder.component.scss',
})
export class RecorderComponent {
  lang = inject(LangService);
  declare recognizer: SpeechRecognizer;
  store = inject(AppStore);
  recognizingStatus = signal<boolean>(false);
  recognizingText = signal('');
  recognizedText = signal<string>('');
  recognizing$ = output<string>();
  recognized$ = output<string>();
  speechService = inject(SpeechService);

  ngOnInit() {}
  async toggleRecording() {
    if (this.store.isRecordingLoading()) return;

    this.store.isRecordingStarted() && this.recognizer
      ? await this.stopRecording()
      : await this.startRecording();
  }

  async stopRecording() {
    if (this.recognizer) {
      this.recognizer.stopContinuousRecognitionAsync(() => {
        this.store.recordingStopped();
        this.cleartext();
      });
    } else {
      this.store.recordingStopped();
    }
  }

  private async startRecording() {
    if (!this.recognizer) {
      await this.prepareRecognizer();
    }

    this.store.recordingInProgress();
    this.recognizer.startContinuousRecognitionAsync(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.recognizer.internalData as unknown as any).privConnectionPromise
        .__zone_symbol__state === true && this.store.recordingStarted();
      this.recognizingStatus.set(true);
    });
  }

  private async prepareRecognizer() {
    // noinspection DuplicatedCode
    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    const langDetection = AutoDetectSourceLanguageConfig.fromLanguages([
      'ar-QA',
      'en-US',
    ]);

    this.recognizer = SpeechRecognizer.FromConfig(
      SpeechConfig.fromAuthorizationToken(
        this.store.speechToken.token(),
        this.store.speechToken.region(),
      ),
      langDetection,
      audioConfig,
    );

    // recognizing event
    this.recognizer.recognizing = (_rec, event) => {
      if (event.result.reason === ResultReason.RecognizingSpeech) {
        this.recognizingText.set(
          this.recognizedText() + ' ' + event.result.text,
        );
        this.recognizing$.emit(this.recognizingText());
        this.recognizingStatus.set(true);
      }
    };

    // recognized event
    this.recognizer.recognized = (_rec, event) => {
      if (
        event.result.reason === ResultReason.RecognizedSpeech &&
        this.store.isRecordingStarted()
      ) {
        this.recognizedText.update(text => text + ' ' + event.result.text);
        this.recognized$.emit(this.recognizedText());
        this.recognizingStatus.set(false);
      }
    };

    this.recognizer.canceled = () => {
      this.store.recordingInProgress();
      this.speechService
        .generateSpeechToken()
        .pipe(take(1))
        .subscribe(() => {
          this.prepareRecognizer().then(() => this.startRecording());
        });
    };

    this.store.recordingStopped();
  }

  cleartext() {
    this.recognizedText.set('');
    this.recognizingText.set('');
  }
}
