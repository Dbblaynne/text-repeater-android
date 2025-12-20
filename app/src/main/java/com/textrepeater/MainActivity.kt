package com.textrepeater
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val inputText = findViewById<EditText>(R.id.inputText)
        val repeatCount = findViewById<EditText>(R.id.repeatCount)
        val repeatButton = findViewById<Button>(R.id.repeatButton)
        val outputText = findViewById<TextView>(R.id.outputText)
        repeatButton.setOnClickListener {
            val text = inputText.text.toString()
            val count = repeatCount.text.toString().toIntOrNull() ?: 1
            if (text.isNotEmpty() && count > 0) {
                val repeated = StringBuilder()
                for (i in 1..count) {
                    repeated.append(text)
                    if (i < count) repeated.append("\n")
                }
                outputText.text = repeated.toString()
            }
        }
    }
}
